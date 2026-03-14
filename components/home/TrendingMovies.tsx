import { getTrending } from "@/lib/api"
import { Card } from "../ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import Link from "next/link"

export default async function TrendingMovies() {
  const res = await getTrending("movie")
  const data = await res.json()

  return (
    <>
      {data.results.slice(0, 4).map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <Card className="p-0">
            <Image
              src={getImageUrl(movie.poster_path, "w342")}
              alt={movie.name}
              width={342}
              height={513}
              className="h-100 w-80"
            />
          </Card>
        </Link>
      ))}
    </>
  )
}
