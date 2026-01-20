import ArtikelDetailClient from "./ArtikelDetailClient";

interface ArtikelDetailPageProps {
  params: Promise<{
    id: string; // Dynamic route param [id]
  }>;
}

export default async function ArtikelDetailPage({
  params,
}: ArtikelDetailPageProps) {
  const { id } = await params;
  // Convert ID string dari URL ke number
  const articleId = parseInt(id);

  return <ArtikelDetailClient articleId={articleId} />;
}
