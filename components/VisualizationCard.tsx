import Link from "next/link";
import { Users, Network, ChevronRight } from "lucide-react";
import type { Visualization } from "@/lib/visualizations";

type VisualizationCardProps = {
  visualization: Visualization;
};


export default function VisualizationCard({ visualization }: VisualizationCardProps) {
  return (
    <article className="group rounded-2xl border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg hover:border-white/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="mt-3 text-base font-semibold tracking-tight text-slate-950">
            {visualization.title}
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {visualization.description}
          </p>
        </div>
      </div>

      <Link
        href={visualization.route}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
      >
        Open Viewer
        <ChevronRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
