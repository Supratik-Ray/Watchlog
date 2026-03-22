import SectionHeader from "@/components/SectionHeader"
import { getByGenre } from "@/lib/api"

export default async function GenreResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: "movie" | "tv" }>
  searchParams: Promise<{ genre: string; name: string; page: string }>
}) {
  const { type } = await params
  const { genre, name, page } = await searchParams

  const currentPage = parseInt(page)

  const data =
    type === "movie"
      ? await getByGenre("movie", genre, currentPage)
      : await getByGenre("tv", genre, currentPage)

  return (
    <>
      <section>
        <SectionHeader>Results for {type} genre</SectionHeader>
        <div className="grid grid-cols-4"></div>
      </section>
    </>
  )
}
