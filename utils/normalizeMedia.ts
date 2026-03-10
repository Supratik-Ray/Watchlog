import { NormalizedMedia } from "@/types/normalized"
import { TMDBMediaItem } from "@/types/tmdb"

export function normalizeMedia(item: TMDBMediaItem): NormalizedMedia {
  return {
    id: item.id,
    mediaType: item.media_type,
    title: item.media_type === "movie" ? item.title : item.name,
    year: (item.media_type === "movie"
      ? item.release_date
      : item.first_air_date
    )?.slice(0, 4),
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    rating: item.vote_average?.toFixed(1),
    overview: item.overview,
  }
}
