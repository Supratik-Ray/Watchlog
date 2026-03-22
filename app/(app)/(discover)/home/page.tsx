import LoadingSkeleton from "@/components/home/LoadingSkeleton"
import TrendingMovies from "@/components/home/TrendingMovies"
import TrendingShows from "@/components/home/TrendingShows"
import { Suspense } from "react"

export default async function HomePage() {
  return (
    <div className="my-8 px-4 sm:my-12 sm:px-6 lg:my-16 lg:px-8">
      {/* trending movies */}
      <section className="container mx-auto mb-8 sm:mb-12">
        <h2 className="mb-6 border-l-4 border-primary pl-3 text-base font-bold sm:text-lg">
          Trending movies
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          <Suspense fallback={<LoadingSkeleton />}>
            <TrendingMovies />
          </Suspense>
        </div>
      </section>

      {/* trending shows */}
      <section className="container mx-auto">
        <h2 className="mb-6 border-l-4 border-primary pl-3 text-base font-bold sm:text-lg">
          Trending TV shows
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          <Suspense fallback={<LoadingSkeleton />}>
            <TrendingShows />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
