import Hero from "@/components/Hero";
import PageShell from "@/components/PageShell";
import VisualizationCard from "@/components/VisualizationCard";
import { visualizationGroups } from "@/lib/visualizations";
import { Users, Network } from "lucide-react";

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

export default function HomePage() {
  return (
    <PageShell>
      <Hero />

      <section
        className="grid gap-4 md:grid-cols-2"
        aria-labelledby="visualization-categories"
      >
        <h2 id="visualization-categories" className="sr-only">
          Visualization categories
        </h2>

        {Object.entries(visualizationGroups).map(([category, items]) => (
          <div
            key={category}
            className="rounded-[1.75rem] border border-white/60 bg-white/55 p-4 shadow-glass backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-sky-100 text-sky-700">
                  {getCategoryIcon(category)}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {category}
                </h3>
              </div>
            </div>

            <div className="grid gap-3">
              {items.map((item) => (
                <VisualizationCard key={item.id} visualization={item} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
