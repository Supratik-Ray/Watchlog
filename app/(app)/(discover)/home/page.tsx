import LoadingSkeleton from "@/components/home/LoadingSkeleton"
import TrendingMovies from "@/components/home/TrendingMovies"
import TrendingShows from "@/components/home/TrendingShows"
import { Suspense } from "react"

export default async function HomePage() {
  //get popular movies

  return (
    <div className="my-16 px-8">
      {/* trending movies */}
      <section className="container mx-auto mb-8">
        <h2 className="mb-6 border-l-5 border-primary pl-3 text-lg font-bold">
          Trending movies
        </h2>
        <div className="grid grid-cols-4 gap-10">
          <Suspense fallback={<LoadingSkeleton />}>
            <TrendingMovies />
          </Suspense>
        </div>
      </section>
      {/* trending shows */}
      <section className="container mx-auto">
        <h2 className="mb-6 border-l-5 border-primary pl-3 text-lg font-bold">
          Trending TV shows
        </h2>
        <div className="grid grid-cols-4 gap-10">
          <Suspense fallback={<LoadingSkeleton />}>
            <TrendingShows />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
