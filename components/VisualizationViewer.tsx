import Link from "next/link";
import { ArrowLeft, ExternalLink, Users, Network } from "lucide-react";
import type { Visualization } from "@/lib/visualizations";

type VisualizationViewerProps = {
  visualization: Visualization;
};

function getCategoryIcon(category: string) {
  switch (category) {
    case "Community Interaction":
      return <Users className="h-5 w-5" />;
    case "Network Structure":
      return <Network className="h-5 w-5" />;
    default:
      return null;
  }
}

export default function VisualizationViewer({
  visualization
}: VisualizationViewerProps) {
  return (
    <article>
      <header className="mb-6 rounded-[1.75rem] border border-white/60 bg-gradient-to-br from-white/70 to-white/50 p-6 shadow-glass backdrop-blur-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-sky-100 text-sky-700">
                {getCategoryIcon(visualization.category)}
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
                {visualization.category}
              </p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {visualization.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {visualization.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <a
              href={visualization.assetPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/65 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-md transition hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              Direct Open
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 shadow-glass backdrop-blur-2xl">
        <iframe
          src={visualization.assetPath}
          title={visualization.title}
          className="h-screen w-full border-none"
        />
      </section>
    </article>
  );
}
