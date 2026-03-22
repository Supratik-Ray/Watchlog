import { getTrending } from "@/lib/api"
import { Card } from "../ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import Link from "next/link"

export default async function TrendingMovies() {
  const data = await getTrending("movie")

  return (
    <>
      {data.results.slice(0, 4).map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id} className="w-full">
          <Card className="w-full overflow-hidden p-0">
            <Image
              src={getImageUrl(movie.poster_path, "w342")}
              alt={movie.title}
              width={342}
              height={513}
              className="h-auto w-full object-cover"
            />
          </Card>
        </Link>
      ))}
    </>
  )
}
