export interface NormalizedMedia {
  id: number
  mediaType: "movie" | "tv"
  title: string
  year: string | undefined
  posterPath: string | null
  backdropPath: string | null
  rating: string
  overview: string
}
