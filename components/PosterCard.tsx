import Link from "next/link"
import { Card } from "./ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { Recommendation, TvRecommendation } from "tmdb-ts"

type PostCardProp = {
  type: "movie" | "tv"
  item: Recommendation | TvRecommendation
}

export default function PosterCard({ type, item }: PostCardProp) {
  const altText =
    type === "movie"
      ? (item as Recommendation).title
      : (item as TvRecommendation).name

  return (
    <Link href={`/${type}/${item.id}`} key={item.id} className="w-full">
      <Card className="p-0">
        <Image
          src={getImageUrl(item.poster_path, "w342")}
          alt={altText}
          width={342}
          height={513}
          className="h-auto w-full object-cover"
        />
      </Card>
    </Link>
  )
}
