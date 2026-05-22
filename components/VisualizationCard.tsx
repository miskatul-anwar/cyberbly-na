import Link from "next/link";
import { ChevronRight, Share2, Users, Waves, Layers } from "lucide-react";
import type { Visualization } from "@/lib/visualizations";
import { cn } from "@/lib/utils";

type VisualizationCardProps = {
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

export default function VisualizationCard({
  visualization,
}: VisualizationCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[1.5rem]",
        "border border-white/50 bg-white/40",
        "shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
        "backdrop-blur-2xl",
        "p-5 transition-all duration-300",
        "hover:-translate-y-1 hover:border-white/70 hover:bg-white/60",
        "hover:shadow-[0_12px_40px_rgba(15,23,42,0.13),inset_0_1px_0_rgba(255,255,255,0.8)]",
      )}
    >
      {/* Specular top-edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />

      {/* Category badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100/80 text-sky-700 backdrop-blur-sm">
          {getCategoryIcon(visualization.category)}
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          {visualization.category}
        </p>
      </div>

      {/* Content */}
      <div className="mt-3 flex-1">
        <h4 className="text-base font-semibold tracking-tight text-slate-950">
          {visualization.title}
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {visualization.description}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={visualization.route}
        className={cn(
          "mt-5 inline-flex items-center gap-2 self-start",
          "rounded-xl border border-slate-950 bg-slate-950",
          "px-4 py-2 text-sm font-semibold text-white",
          "shadow-[0_2px_8px_rgba(15,23,42,0.3)]",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-slate-800 hover:bg-slate-800",
          "hover:shadow-[0_6px_16px_rgba(15,23,42,0.35)]",
          "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
        )}
      >
        Open Viewer
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
