import { getTrending } from "@/lib/api"
import { Card } from "../ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import Link from "next/link"

export default async function TrendingShows() {
  const res = await getTrending("tv")
  const data = await res.json()

  return (
    <>
      {data.results.slice(0, 4).map((show) => (
        <Link href={`/movie/${show.id}`} key={show.id}>
        <Card className="p-0">
          <Image
            src={getImageUrl(show.poster_path, "w342")}
            alt={show.name}
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
