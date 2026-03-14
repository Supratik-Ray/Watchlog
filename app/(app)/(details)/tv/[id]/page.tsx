import DetailsPage from "@/components/details/detailsPage"

export default async function TvShowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <DetailsPage params={params} type="tv" />
}
