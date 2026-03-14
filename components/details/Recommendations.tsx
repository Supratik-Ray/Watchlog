import { getRecommendations } from "@/lib/api"
import PosterCard from "../PosterCard"
import RecommendationsCarousel from "./RecommendationsCarousel"

type RecommendationProps = {
  id: string
  type: "movie" | "tv"
}

export default async function Recommendations({
  id,
  type,
}: RecommendationProps) {
  const res = await getRecommendations(type, id)
  const data = await res.json()
  return <RecommendationsCarousel data={data} type={type} />
}
