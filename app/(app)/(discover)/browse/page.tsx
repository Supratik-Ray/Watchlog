import Link from "next/link"
import SectionHeader from "@/components/SectionHeader"

const genreColors = [
  "bg-red-900/60 hover:bg-red-900/80",
  "bg-amber-900/60 hover:bg-amber-900/80",
  "bg-yellow-900/60 hover:bg-yellow-900/80",
  "bg-green-900/60 hover:bg-green-900/80",
  "bg-teal-900/60 hover:bg-teal-900/80",
  "bg-blue-900/60 hover:bg-blue-900/80",
  "bg-indigo-900/60 hover:bg-indigo-900/80",
  "bg-purple-900/60 hover:bg-purple-900/80",
  "bg-pink-900/60 hover:bg-pink-900/80",
  "bg-rose-900/60 hover:bg-rose-900/80",
  "bg-orange-900/60 hover:bg-orange-900/80",
  "bg-cyan-900/60 hover:bg-cyan-900/80",
]

async function getGenres(type: "movie" | "tv") {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/${type}/list?language=en`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 86400 },
    }
  )
  const data = await res.json()
  return data.genres as { id: number; name: string }[]
}

export default async function BrowsePage() {
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres("movie"),
    getGenres("tv"),
  ])

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-14">
        <SectionHeader>Browse movies by genre</SectionHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {movieGenres.map((genre, i) => (
            <Link
              key={genre.id}
              href={`/browse/movie?genre=${genre.id}&name=${genre.name}`}
            >
              <div
                className={`${genreColors[i % genreColors.length]} flex h-20 cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg sm:h-24 sm:text-base`}
              >
                {genre.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Browse TV shows by genre</SectionHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {tvGenres.map((genre, i) => (
            <Link
              key={genre.id}
              href={`/browse/tv?genre=${genre.id}&name=${genre.name}`}
            >
              <div
                className={`${genreColors[i % genreColors.length]} flex h-20 cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg sm:h-24 sm:text-base`}
              >
                {genre.name}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
