import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section
      className={cn(
        "relative mb-5 overflow-hidden rounded-[1.75rem]",
        "border border-white/50 bg-white/40",
        "shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
        "backdrop-blur-2xl",
        "p-6 md:p-10",
      )}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-16 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl pointer-events-none"
      />

      {/* Specular top-edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />

      <div className="relative max-w-4xl">
        {/* Eyebrow label */}
        {/* <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">
          Supplementary Material
        </p> */}

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          Supplementary Visualization Viewer
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-500 md:text-lg">
          This work presents an ontology-driven cyberbullying network analysis
          framework that models cyberbullying from a perpetrator-centric
          perspective. It connects semantic knowledge graph construction,
          behavioral representation, similarity-based network modeling,
          community and sub-community detection, feature contribution analysis,
          and influence propagation.
        </p>
      </div>
    </section>
  );
}