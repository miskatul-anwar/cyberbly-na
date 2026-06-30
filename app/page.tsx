import Hero from "@/components/Hero";
import PageShell from "@/components/PageShell";
import VisualizationCard from "@/components/VisualizationCard";
import { visualizationGroups } from "@/lib/visualizations";
import { Share2, Users, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

function getCategoryIcon(category: string) {
  switch (category) {
    case "Network Structure":
      return <Share2 className="h-5 w-5" aria-hidden="true" />;
    case "Community Interaction":
      return <Users className="h-5 w-5" aria-hidden="true" />;
    case "Diffusion Visualization":
      return <Waves className="h-5 w-5" aria-hidden="true" />;
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
            className={cn(
              // Single-item groups (Diffusion) span full width
              items.length === 1 && "md:col-span-2",
              "relative rounded-[1.75rem]",
              "border border-white/50 bg-white/40",
              "shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
              "backdrop-blur-2xl p-4",
            )}
          >
            {/* Specular top-edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            />

            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100/80 text-sky-700">
                {getCategoryIcon(category)}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                {category}
              </h3>
            </div>

            {/* Cards — side-by-side when group is full-width and has 2+ items */}
            <div
              className={cn(
                "grid gap-3",
                items.length === 1 ? "md:grid-cols-1 max-w-xl" : "grid-cols-1",
              )}
            >
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
