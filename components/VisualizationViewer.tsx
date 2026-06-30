import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  Users,
  Waves,
  Layers,
} from "lucide-react";
import type { Visualization } from "@/lib/visualizations";
import { cn } from "@/lib/utils";

type VisualizationViewerProps = {
  visualization: Visualization;
};

function getCategoryIcon(category: string) {
  switch (category) {
    case "Network Structure":
      return <Share2 className="h-4 w-4" aria-hidden="true" />;
    case "Community Interaction":
      return <Users className="h-4 w-4" aria-hidden="true" />;
    case "Diffusion Visualization":
      return <Waves className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Layers className="h-4 w-4" aria-hidden="true" />;
  }
}

export default function VisualizationViewer({
  visualization,
}: VisualizationViewerProps) {
  return (
    <article className="space-y-4">
      {/* Header card */}
      <header
        className={cn(
          "relative overflow-hidden rounded-[1.75rem]",
          "border border-white/50 bg-white/40",
          "shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "backdrop-blur-2xl p-6",
        )}
      >
        {/* Ambient blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl"
        />
        {/* Specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100/80 text-sky-700 backdrop-blur-sm">
                {getCategoryIcon(visualization.category)}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {visualization.category}
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {visualization.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              {visualization.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl",
                "border border-slate-950 bg-slate-950",
                "px-4 py-2.5 text-sm font-semibold text-white",
                "shadow-[0_2px_8px_rgba(15,23,42,0.3)]",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-slate-800 hover:bg-slate-800",
                "hover:shadow-[0_6px_16px_rgba(15,23,42,0.35)]",
                "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Link>

            <a
              href={visualization.assetPath}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl",
                "border border-white/60 bg-white/50",
                "px-4 py-2.5 text-sm font-semibold text-slate-700",
                "shadow-[0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]",
                "backdrop-blur-xl transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/70",
                "hover:shadow-[0_6px_16px_rgba(15,23,42,0.1)]",
                "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
              )}
            >
              Direct Open
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* iframe panel */}
      <section
        className={cn(
          "overflow-hidden rounded-[1.75rem]",
          "border border-white/50 bg-white/40",
          "shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "backdrop-blur-2xl",
        )}
      >
        <iframe
          src={visualization.assetPath}
          title={visualization.title}
          className="h-screen w-full border-none"
        />
      </section>
    </article>
  );
}
