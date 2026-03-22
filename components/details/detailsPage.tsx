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
import MediaActions from "./MediaActions"
import { Suspense } from "react"
import LoadingSkeleton from "../home/LoadingSkeleton"
import Recommendations from "./Recommendations"
import { auth } from "@clerk/nextjs/server"
import MediaActionArea from "./MediaActionArea"

export default async function DetailsPage({
  params,
  type,
}: {
  params: Promise<{ id: string }>
  type: "movie" | "tv"
}) {
  const { id } = await params
  const { userId } = await auth()

  const data =
    type === "movie"
      ? await getDetails("movie", id)
      : await getDetails("tv", id)

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
      {/* hero banner */}
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="relative mb-8 flex min-h-64 w-dvw items-center justify-center bg-cover bg-center sm:h-80 lg:h-100"
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-50 mx-4 flex w-full max-w-3xl flex-col items-center gap-5 rounded-md bg-black/50 p-5 shadow-md backdrop-blur-sm sm:mx-8 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
          {/* poster */}
          <div className="w-28 shrink-0 overflow-hidden rounded-md shadow-md sm:w-40 lg:w-[200px]">
            <Image
              src={getImageUrl(data.poster_path, "w500")}
              alt={title}
              width={200}
              height={350}
              className="w-full object-cover"
            />
          </div>

          {/* details */}
          <div className="space-y-3 text-center sm:space-y-4 sm:text-left">
            {/* genres */}
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {data.genres.map((genre) => (
                <span
                  className="rounded-full bg-primary px-2 py-1 text-xs"
                  key={genre.id}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
              {title}
            </h1>

            {data.tagline && (
              <p className="text-sm font-bold text-white/80 sm:text-base">
                {data.tagline}
              </p>
            )}

            {/* meta row */}
            <div className="flex flex-wrap justify-center gap-3 text-sm sm:justify-start sm:gap-4">
              <div className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-chart-3" size={15} />
                <span>
                  {data.vote_average} ({data.vote_count})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon weight="bold" className="text-chart-3" size={15} />
                <span>{runtime}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarCheckIcon
                  weight="bold"
                  className="text-chart-3"
                  size={15}
                />
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

      {/* overview + actions */}
      <section className="container mx-auto mb-8 flex flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        <div className="flex-2 space-y-4">
          <SectionHeader>Overview</SectionHeader>
          <p className="text-sm leading-relaxed sm:text-base">
            {data.overview}
          </p>
        </div>
        <MediaActionArea
          mediaId={data.id.toString()}
          mediaType={type}
          mediaTitle={title}
          mediaPoster={data.poster_path}
        />
      </section>

      {/* recommendations */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader>More Like this</SectionHeader>
        <Suspense fallback={<LoadingSkeleton />}>
          <Recommendations id={id} type={type} />
        </Suspense>
      </section>
    </>
  )
}
