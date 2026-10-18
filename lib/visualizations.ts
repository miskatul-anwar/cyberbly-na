// ---------------------------------------------------------------------------
// Single source of truth for all visualizations.
//
// Group display order:
//   1. Network Structure
//   2. Community Interaction
//   3. Diffusion Visualization
//
// Network Structure item order:
//   1. Perpetrator Similarity Network
//   2. Perpetrator Community Network
//   3. Perpetrator Sub-community Network
// ---------------------------------------------------------------------------

export type VisualizationCategory =
  | "Network Structure"
  | "Community Interaction"
  | "Diffusion Visualization";

export type Visualization = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: VisualizationCategory;
  route: string;
  assetPath: string;
};

export const visualizations: Visualization[] = [
  // ── Network Structure (order: Similarity → Community → Sub-community) ───
  {
    id: "perpetrator-similarity",
    slug: "perpetrator-similarity",
    title: "Perpetrator Similarity Network",
    description:
      "Similarity-based network where perpetrators are connected by behavioral proximity scores above a minimum threshold (minSim = 0.80), revealing clusters of users who exhibit comparable cyberbullying patterns.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-similarity",
    assetPath:
      "/figures/network_structure/perp-similarity-graph-minSim-0.80.html",
  },
  {
    id: "perpetrator-community",
    slug: "perpetrator-community",
    title: "Perpetrator Community Network",
    description:
      "Annotated network overlaying detected communities onto the perpetrator similarity graph, highlighting how offenders cluster into distinct behavioral communities.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-community",
    assetPath: "/figures/network_structure/perpetrator_community_network.html",
  },
  {
    id: "perpetrator-subcommunity",
    slug: "perpetrator-subcommunity",
    title: "Perpetrator Sub-community Network",
    description:
      "Zoomed-in view of the intra-community structure, decomposing each major community into finer sub-communities to expose hierarchical groupings among perpetrators.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-subcommunity",
    assetPath: "/figures/network_structure/perp_subcommunity_network.html",
  },

  // ── Community Interaction ────────────────────────────────────────────────
  {
    id: "community-behavior",
    slug: "community-behavior",
    title: "Community Behavior Graph",
    description:
      "Interactive graph illustrating how different perpetrator communities interact through shared behavioral contexts, exposing cross-community influence and overlap.",
    category: "Community Interaction",
    route: "/visualizations/community-behavior",
    assetPath: "/figures/community_interaction/community_behavior_graphA.html",
  },
  {
    id: "community-context",
    slug: "community-context",
    title: "Community Context Graph",
    description:
      "Contextual network mapping the situational and semantic contexts in which community-level cyberbullying behaviors co-occur, linking communities to shared discourse themes.",
    category: "Community Interaction",
    route: "/visualizations/community-context",
    assetPath: "/figures/community_interaction/community_context_graphB.html",
  },

  // ── Diffusion Visualization ──────────────────────────────────────────────
  {
    id: "diffusion-all-methods",
    slug: "diffusion-all-methods",
    title: "Diffusion — All Methods",
    description:
      "Comparative visualization of influence diffusion across perpetrator communities using multiple propagation models, enabling side-by-side evaluation of how cyberbullying behavior spreads under different assumptions.",
    category: "Diffusion Visualization",
    route: "/visualizations/diffusion-all-methods",
    assetPath:
      "/figures/diffusion_visualization/diffusion_community_5_all_methods.html",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getVisualizationBySlug(
  slug: string,
): Visualization | undefined {
  return visualizations.find((v) => v.slug === slug);
}

// Groups in the explicit display order defined above.
// Using a const array (not Object.keys) guarantees order is never
// subject to JS engine key-insertion quirks.
const CATEGORY_ORDER: VisualizationCategory[] = [
  "Network Structure",
  "Community Interaction",
  "Diffusion Visualization",
];

export const visualizationGroups: Record<
  VisualizationCategory,
  Visualization[]
> = CATEGORY_ORDER.reduce(
  (acc, cat) => {
    acc[cat] = visualizations.filter((v) => v.category === cat);
    return acc;
  },
  {} as Record<VisualizationCategory, Visualization[]>,
);
