interface TMDBMovie {
  id: number
  media_type: "movie"
  title: string
  original_title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  video: boolean
}

interface TMDBTVShow {
  id: number
  media_type: "tv"
  name: string
  original_name: string
  first_air_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  origin_country: string[]
}

export type TMDBMediaItem = TMDBMovie | TMDBTVShow
