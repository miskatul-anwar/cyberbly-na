export default function Hero() {
  return (
    <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-glass backdrop-blur-2xl md:p-10">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-16 h-72 w-72 rounded-full bg-slate-200/80 blur-3xl"
      />

      <div className="relative max-w-4xl">
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          Supplementary Visualization Viewer
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
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
