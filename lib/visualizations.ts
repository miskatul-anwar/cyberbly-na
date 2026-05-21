export type VisualizationCategory =
  | "Community Interaction"
  | "Network Structure";

export type Visualization = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: VisualizationCategory;
  route: string;
  assetPath: string;
  icon?: "users" | "network";
};

export const visualizations: Visualization[] = [
  {
    id: "community-behavior",
    slug: "community-behavior",
    title: "Community Behavior Graph",
    description:
      "Interactive representation of community-level behavioral relationships in the ontology-driven framework.",
    category: "Community Interaction",
    route: "/visualizations/community-behavior",
    assetPath: "/figures/community_interaction/community_behavior_graphA.html",
    icon: "users"
  },
  {
    id: "community-context",
    slug: "community-context",
    title: "Community Context Graph",
    description:
      "Interactive view of contextual associations connecting cyberbullying communities and semantic knowledge structures.",
    category: "Community Interaction",
    route: "/visualizations/community-context",
    assetPath: "/figures/community_interaction/community_context_graphB.html",
    icon: "users"
  },
  {
    id: "perpetrator-similarity",
    slug: "perpetrator-similarity",
    title: "Perpetrator Similarity Graph",
    description:
      "Similarity-based network visualization showing perpetrator-centric behavioral proximity at the selected threshold.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-similarity",
    assetPath:
      "/figures/network_structure/perp-similarity-graph-minSim-0.80.html",
    icon: "network"
  },
  {
    id: "perpetrator-subcommunity",
    slug: "perpetrator-subcommunity",
    title: "Perpetrator Subcommunity Network",
    description:
      "Interactive visualization of detected sub-community organization within the perpetrator-centric network.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-subcommunity",
    assetPath: "/figures/network_structure/perp_subcommunity_network.html",
    icon: "network"
  },
  {
    id: "perpetrator-community",
    slug: "perpetrator-community",
    title: "Perpetrator Community Network",
    description:
      "Community-level perpetrator network view supporting reviewer inspection of structural patterns.",
    category: "Network Structure",
    route: "/visualizations/perpetrator-community",
    assetPath: "/figures/network_structure/perpetrator_community_network.html",
    icon: "network"
  }
];

export function getVisualizationBySlug(
  slug: string
): Visualization | undefined {
  return visualizations.find((item) => item.slug === slug);
}

export const visualizationGroups = visualizations.reduce<
  Record<VisualizationCategory, Visualization[]>
>(
  (groups, item) => {
    groups[item.category].push(item);
    return groups;
  },
  {
    "Community Interaction": [],
    "Network Structure": []
  }
);


