"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DataSet } from "vis-network/standalone";
import type { Edge, Network, Node, Options } from "vis-network";

type GraphNode = Node & {
  id: string | number;
  group?: string;
  nodeStatus?: string;
  fixedColor?: string;
  fixedBorder?: string;
  title?: string;
};
type GraphEdge = Edge & {
  id?: string | number;
  edgeStatus?: string;
};
type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  options: Options;
};
type Runtime = {
  network: Network;
  nodes: DataSet<Node, "id">;
  edges: DataSet<Edge, "id">;
  sourceNodes: GraphNode[];
};
type FilterOption = { id: string; label: string; color: string };

const DIFFUSION_METHODS = [
  { id: "imgreedy", label: "IM Greedy", steps: 5 },
  { id: "bullyonly", label: "Bully-Only", steps: 6 },
  { id: "weighteddegree", label: "Weighted Degree", steps: 6 },
  { id: "pagerank", label: "PageRank", steps: 6 },
] as const;

const FILTER_OPTIONS: Record<string, FilterOption[]> = {
  "community-behavior": [
    { id: "PerpProfile", label: "Perp Profile", color: "#3C78D8" },
    { id: "Video", label: "Video", color: "#CC7722" },
    { id: "Impact", label: "Impact", color: "#C0504D" },
  ],
  "community-context": [
    { id: "Party", label: "Political Party", color: "#4908BF" },
    { id: "Channel", label: "News Channel", color: "#2E8B57" },
    { id: "Language", label: "Language", color: "#A134A3" },
    { id: "Target", label: "Target Identity", color: "#E67E22" },
    { id: "TimeBin", label: "Time", color: "#B0982E" },
  ],
};

function controlClass(active: boolean) {
  return [
    "inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
    active
      ? "border-slate-950 bg-slate-950 text-white"
      : "border-slate-200 bg-white/75 text-slate-700 hover:bg-white",
  ].join(" ");
}

function fit(runtime: Runtime, current: React.RefObject<Runtime | null>) {
  if (current.current !== runtime) return;
  runtime.network.fit({ animation: false });
}

function applyDiffusionMode(runtime: Runtime, mode: "activated" | "all") {
  runtime.nodes.update(
    runtime.sourceNodes.map((node) => {
      const background = node.fixedColor || "#BDBDBD";
      const border = node.fixedBorder || "#888888";
      return {
        id: node.id,
        hidden: mode === "activated" && node.nodeStatus === "Inactive",
        color: {
          background,
          border,
          highlight: { background, border: "#000000" },
          hover: { background, border: "#000000" },
        },
      };
    }),
  );
  runtime.edges.update(
    runtime.edges.get().map((edge) => ({
      id: edge.id!,
      hidden:
        (edge as GraphEdge).edgeStatus !== "CurrentInfluence" &&
        (edge as GraphEdge).edgeStatus !== "PastInfluence",
    })),
  );
}

export default function NativeGraph({ slug }: { slug: string }) {
  const isDiffusion = slug === "diffusion-all-methods";
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const modeRef = useRef<"activated" | "all">("activated");
  const [method, setMethod] = useState("imgreedy");
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"activated" | "all">("activated");
  const [filter, setFilter] = useState("all");
  const [parents, setParents] = useState<{ id: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [counts, setCounts] = useState<{ nodes: number; edges: number } | null>(null);

  const dataPath = useMemo(
    () =>
      isDiffusion
        ? `/native-graphs/diffusion/${method}/step-${step}.json`
        : `/native-graphs/${slug}.json`,
    [isDiffusion, method, slug, step],
  );

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    let afterDraw: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      setLoading(true);
      setError(null);
      setProgress(0);
      setCounts(null);
      setFilter("all");
      setParents([]);
      setMode("activated");
      modeRef.current = "activated";

      try {
        const [response, library] = await Promise.all([
          fetch(dataPath, { signal: controller.signal, cache: "force-cache" }),
          import("vis-network/standalone"),
        ]);
        if (!response.ok) throw new Error(`Graph data returned ${response.status}`);
        const payload = (await response.json()) as GraphPayload;
        if (cancelled || !containerRef.current) return;

        const nodes = new library.DataSet<Node, "id">(payload.nodes);
        const edges = new library.DataSet<Edge, "id">(payload.edges);
        const network = new library.Network(containerRef.current, { nodes, edges }, payload.options);
        const runtime: Runtime = {
          network,
          nodes,
          edges,
          sourceNodes: payload.nodes,
        };
        runtimeRef.current = runtime;
        setCounts({ nodes: payload.nodes.length, edges: payload.edges.length });

        if (slug === "perpetrator-subcommunity") {
          const found = new Map<string, string>();
          payload.nodes.forEach((node) => {
            const parent = String(node.title || "").match(/parent=(\d+)/)?.[1];
            if (parent && !found.has(parent)) {
              const color = typeof node.color === "string" ? node.color : node.color?.background || "#64748b";
              found.set(parent, color);
            }
          });
          setParents([...found].map(([id, color]) => ({ id, color })).sort((a, b) => Number(a.id) - Number(b.id)));
        }

        let settled = false;
        const finishLayout = () => {
          if (cancelled || settled || runtimeRef.current !== runtime) return;
          settled = true;
          if (deadline) clearTimeout(deadline);
          network.setOptions({ physics: { enabled: false } });
          fit(runtime, runtimeRef);
          if (slug === "perpetrator-similarity") setProgress(100);
        };

        if (isDiffusion) {
          network.once("afterDrawing", () => {
            if (cancelled || runtimeRef.current !== runtime) return;
            applyDiffusionMode(runtime, modeRef.current);
            setLoading(false);
            afterDraw = setTimeout(() => {
              if (runtimeRef.current !== runtime) return;
              network.setOptions({ physics: { enabled: false } });
              fit(runtime, runtimeRef);
            }, 800);
          });
        } else {
          network.once("afterDrawing", () => {
            if (!cancelled) setLoading(false);
          });
          network.once("stabilizationIterationsDone", finishLayout);
          deadline = setTimeout(finishLayout, slug === "perpetrator-similarity" ? 20000 : 3000);
          if (slug === "perpetrator-similarity") {
            network.on("stabilizationProgress", (event) => {
              if (!cancelled) setProgress(Math.round((event.iterations / event.total) * 100));
            });
          }
        }
      } catch (cause) {
        if (cancelled || controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Could not load graph data.");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
      if (deadline) clearTimeout(deadline);
      if (afterDraw) clearTimeout(afterDraw);
      runtimeRef.current?.network.destroy();
      runtimeRef.current = null;
    };
  }, [dataPath, isDiffusion, slug]);

  function applyFilter(next: string) {
    setFilter(next);
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.nodes.update(
      runtime.sourceNodes.map((node) => ({
        id: node.id,
        hidden:
          next === "all"
            ? false
            : slug === "perpetrator-subcommunity"
              ? String(node.title || "").match(/parent=(\d+)/)?.[1] !== next
              : node.group !== "Community" && node.group !== next,
      })),
    );
    setTimeout(() => fit(runtime, runtimeRef), 80);
  }

  function relayout() {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      if (runtimeRef.current !== runtime) return;
      runtime.network.setOptions({ physics: { enabled: false } });
      fit(runtime, runtimeRef);
    };
    runtime.network.once("stabilizationIterationsDone", finish);
    const deadline = setTimeout(finish, 3000);
    runtime.network.setOptions({ physics: { enabled: true } });
    runtime.network.stabilize(200);
  }

  function changeMode(next: "activated" | "all") {
    setMode(next);
    modeRef.current = next;
    const runtime = runtimeRef.current;
    if (!runtime) return;
    applyDiffusionMode(runtime, next);
    setTimeout(() => fit(runtime, runtimeRef), 120);
  }

  const currentMethod = DIFFUSION_METHODS.find((entry) => entry.id === method)!;

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 bg-white/45 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">Interactive network</p>
          <p className="text-xs text-slate-500">Pan, zoom, and hover for graph details.</p>
        </div>
        {counts && (
          <p className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600" role="status">
            {counts.nodes.toLocaleString()} nodes · {counts.edges.toLocaleString()} edges
          </p>
        )}
      </div>

      {isDiffusion && (
        <div className="space-y-3 border-b border-slate-200/70 bg-white/45 p-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Diffusion method">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Method</span>
            {DIFFUSION_METHODS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={method === entry.id}
                className={controlClass(method === entry.id)}
                onClick={() => { setMethod(entry.id); setStep(0); }}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Diffusion step">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Step</span>
            {Array.from({ length: currentMethod.steps }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-pressed={step === index}
                className={controlClass(step === index)}
                onClick={() => setStep(index)}
              >
                {index}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Diffusion node view">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">View</span>
            <button type="button" aria-pressed={mode === "activated"} className={controlClass(mode === "activated")} onClick={() => changeMode("activated")}>Activated</button>
            <button type="button" aria-pressed={mode === "all"} className={controlClass(mode === "all")} onClick={() => changeMode("all")}>Show inactive nodes</button>
          </div>
        </div>
      )}

      {slug === "perpetrator-subcommunity" && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 bg-white/45 p-4" role="group" aria-label="Parent community filter">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Parent community</span>
          <button type="button" aria-pressed={filter === "all"} className={controlClass(filter === "all")} onClick={() => applyFilter("all")}>All</button>
          {parents.map((parent) => (
            <button key={parent.id} type="button" aria-pressed={filter === parent.id} className={controlClass(filter === parent.id)} onClick={() => applyFilter(parent.id)}>
              <span className="h-2.5 w-2.5 rounded-full border border-slate-900/20" style={{ backgroundColor: parent.color }} aria-hidden="true" />
              C{parent.id}
            </button>
          ))}
        </div>
      )}

      {FILTER_OPTIONS[slug] && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 bg-white/45 p-4" role="group" aria-label="Graph node filter">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Show</span>
          <button type="button" aria-pressed={filter === "all"} className={controlClass(filter === "all")} onClick={() => applyFilter("all")}>All</button>
          {FILTER_OPTIONS[slug].map((option) => (
            <button key={option.id} type="button" aria-pressed={filter === option.id} className={controlClass(filter === option.id)} onClick={() => applyFilter(option.id)}>
              <span className="h-2.5 w-2.5 rounded-full border border-slate-900/20" style={{ backgroundColor: option.color }} aria-hidden="true" />
              {option.label}
            </button>
          ))}
          <button type="button" className={controlClass(false)} onClick={relayout}>Re-layout</button>
        </div>
      )}

      {slug === "perpetrator-community" && (
        <p className="border-b border-slate-200/70 bg-white/45 px-4 py-3 text-xs text-slate-600">
          Node size shows community size. Edge width shows connection strength. Hover for exact values.
        </p>
      )}
      {slug === "perpetrator-subcommunity" && (
        <p className="border-b border-slate-200/70 bg-white/45 px-4 py-3 text-xs text-slate-600">
          Select a parent community to focus on its subcommunities. Hover for exact values.
        </p>
      )}

      <div className="relative bg-white/80">
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: isDiffusion ? "min(75vh, 800px)" : "min(72vh, 760px)", minHeight: isDiffusion ? 520 : 420 }}
          aria-label="Interactive network graph"
        />
        {loading && !error && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/65 text-sm font-medium text-slate-700" role="status">
            {slug === "perpetrator-similarity" && progress > 0
              ? `Arranging network… ${progress}%`
              : "Loading network…"}
          </div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center bg-white/90 p-6 text-center text-sm text-rose-700" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
