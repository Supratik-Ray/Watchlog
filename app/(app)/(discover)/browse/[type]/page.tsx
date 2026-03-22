import GenreResultPagination from "@/components/browse/GenreResultPagination"
import PosterCard from "@/components/PosterCard"
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
  console.log("page", page)

  const currentPage = isNaN(parseInt(page)) ? 1 : parseInt(page)
  console.log(currentPage)

  const data =
    type === "movie"
      ? await getByGenre("movie", genre, currentPage)
      : await getByGenre("tv", genre, currentPage)

  const baseLink = `/browse/${type}?genre=${genre}&name=${name}`

  return (
    <>
      <section className="container mx-auto mt-8 mb-16">
        <div className="px-8 lg:px-0">
          <SectionHeader>Results for {name} genre</SectionHeader>
        </div>
        <div className="grid grid-cols-1 gap-6 p-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:p-0 lg:grid-cols-4 lg:gap-10">
          {data.results?.map((result) => (
            <PosterCard item={result} type={type} key={result.id} />
          ))}
        </div>
      </section>
      <section className="mb-8">
        <GenreResultPagination
          currentPage={currentPage}
          totalPages={data.total_pages}
          baseLink={baseLink}
        />
      </section>
    </>
  )
}
