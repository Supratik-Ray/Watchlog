import DetailsPage from "@/components/details/detailsPage"

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <DetailsPage params={params} type="movie" />
}
