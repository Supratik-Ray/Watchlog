import { getRecommendations } from "@/lib/api"
import RecommendationsCarousel from "./RecommendationsCarousel"

type RecommendationProps = {
  id: string
  type: "movie" | "tv"
}

export default async function Recommendations({
  id,
  type,
}: RecommendationProps) {
  if (type === "movie") {
    const data = await getRecommendations("movie", id)
    return <RecommendationsCarousel data={data} type={type} />
  } else {
    const data = await getRecommendations("tv", id)
    return <RecommendationsCarousel data={data} type={type} />
  }
}
