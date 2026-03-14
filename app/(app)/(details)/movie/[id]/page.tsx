import MovieActions from "@/components/details/MovieActions"
import Recommendations from "@/components/details/Recommendations"
import LoadingSkeleton from "@/components/home/LoadingSkeleton"
import SectionHeader from "@/components/SectionHeader"
import { Card } from "@/components/ui/card"
import { getDetails } from "@/lib/api"
import { formatMovieRuntime } from "@/lib/formatMovieRuntime"
import { getImageUrl } from "@/lib/getImageUrl"
import {
  CalendarCheckIcon,
  ClockIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Suspense } from "react"

export default async function showMovies({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getDetails("movie", id)
  const imageUrl = getImageUrl(data.backdrop_path, "w1280")
  console.log(data)
  return (
    <>
      {/* Section Header with banner Image */}
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="relative mb-8 flex h-100 w-dvw items-center justify-center bg-cover bg-center"
      >
        {/* blur */}
        <div className="absolute inset-0" />
        {/* section header card content */}
        <div className="relative z-50 flex gap-8 rounded-md bg-black/50 p-8 shadow-md backdrop-blur-sm">
          {/* movie poster */}
          <div className="overflow-hidden rounded-md shadow-md">
            <Image
              src={getImageUrl(data.poster_path, "w500")}
              alt={data.title}
              width={200}
              height={350}
            />
          </div>
          {/* movie details */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {data.genres.map((genre) => (
                <span
                  className="rounded-full bg-primary px-2 py-1 text-xs"
                  key={genre.id}
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <p className="font-bold text-white">{data.tagline}</p>
            <div className="flex gap-4">
              {/* Ratings */}
              <div className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-chart-3" />
                <span>
                  {data.vote_average}({data.vote_count})
                </span>
              </div>
              {/* runtime */}
              <div className="flex items-center gap-1">
                <ClockIcon weight="bold" className="text-chart-3" />
                <span>{formatMovieRuntime(data.runtime)}</span>
              </div>
              {/* release date */}
              <div className="flex items-center gap-1">
                <CalendarCheckIcon weight="bold" className="text-chart-3" />
                <span>{data.release_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overview section */}
      <section className="container mx-auto mb-8 flex gap-8">
        <div className="flex-2 space-y-4">
          <SectionHeader>Overview</SectionHeader>
          <p>{data.overview}</p>
        </div>
        <Card className="flex flex-1 p-8">
          <MovieActions />
        </Card>
      </section>

      {/* More like this section */}
      <section className="container mx-auto">
        <SectionHeader>More Like this</SectionHeader>
        <Suspense fallback={<LoadingSkeleton />}>
          <Recommendations id={id} type="movie" />
        </Suspense>
      </section>
    </>
  )
}
