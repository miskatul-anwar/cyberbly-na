import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import VisualizationViewer from "@/components/VisualizationViewer";
import {
  getVisualizationBySlug,
  visualizations
} from "@/lib/visualizations";

type VisualizationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return visualizations.map((item) => ({
    slug: item.slug
  }));
}

export async function generateMetadata({
  params
}: VisualizationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const visualization = getVisualizationBySlug(slug);

  if (!visualization) {
    return {
      title: "Visualization Not Found"
    };
  }

  return {
    title: visualization.title,
    description: visualization.description,
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function VisualizationPage({
  params
}: VisualizationPageProps) {
  const { slug } = await params;
  const visualization = getVisualizationBySlug(slug);

  if (!visualization) {
    notFound();
  }

  return (
    <PageShell compact>
      <VisualizationViewer visualization={visualization} />
    </PageShell>
  );
}
