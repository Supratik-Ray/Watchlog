import { getDetails } from "@/lib/api"
import { formatMovieRuntime } from "@/lib/formatMovieRuntime"
import { getImageUrl } from "@/lib/getImageUrl"
import {
  CalendarCheckIcon,
  ClockIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import type { MovieDetails, TvShowDetails } from "tmdb-ts"
import SectionHeader from "../SectionHeader"
import { Card } from "../ui/card"
import MovieActions from "./MovieActions"
import { Suspense } from "react"
import LoadingSkeleton from "../home/LoadingSkeleton"
import Recommendations from "./Recommendations"

export default async function DetailsPage({
  params,
  type,
}: {
  params: Promise<{ id: string }>
  type: "movie" | "tv"
}) {
  const { id } = await params

  const data =
    type === "movie"
      ? await getDetails("movie", id)
      : await getDetails("tv", id)

  // normalize differing fields
  const title =
    type === "movie"
      ? (data as MovieDetails).title
      : (data as TvShowDetails).name

  const releaseDate =
    type === "movie"
      ? (data as MovieDetails).release_date
      : (data as TvShowDetails).first_air_date

  const runtime =
    type === "movie"
      ? formatMovieRuntime((data as MovieDetails).runtime)
      : `${(data as TvShowDetails).episode_run_time[0] ?? "N/A"} min / ep`

  const imageUrl = getImageUrl(data.backdrop_path, "w1280")

  return (
    <>
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="relative mb-8 flex h-100 w-dvw items-center justify-center bg-cover bg-center"
      >
        <div className="absolute inset-0" />
        <div className="relative z-50 flex gap-8 rounded-md bg-black/50 p-8 shadow-md backdrop-blur-sm">
          <div className="overflow-hidden rounded-md shadow-md">
            <Image
              src={getImageUrl(data.poster_path, "w500")}
              alt={title}
              width={200}
              height={350}
            />
          </div>
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
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="font-bold text-white">{data.tagline}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-chart-3" />
                <span>
                  {data.vote_average}({data.vote_count})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon weight="bold" className="text-chart-3" />
                <span>{runtime}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarCheckIcon weight="bold" className="text-chart-3" />
                <span>{releaseDate}</span>
              </div>
              {type === "tv" && (
                <div className="flex items-center gap-1">
                  <span>
                    {(data as TvShowDetails).number_of_episodes} episodes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto mb-8 flex gap-8">
        <div className="flex-2 space-y-4">
          <SectionHeader>Overview</SectionHeader>
          <p>{data.overview}</p>
        </div>
        <Card className="flex flex-1 p-8">
          <MovieActions />
        </Card>
      </section>

      <section className="container mx-auto">
        <SectionHeader>More Like this</SectionHeader>
        <Suspense fallback={<LoadingSkeleton />}>
          <Recommendations id={id} type={type} />
        </Suspense>
      </section>
    </>
  )
}
