import {
  MovieDetails,
  TvShowDetails,
  TrendingResults,
  Recommendations,
  TvRecommendations,
  MovieDiscoverResult,
  TvShowDiscoverResult,
} from "tmdb-ts"
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
}

export function getMultiSearchResult(query: string) {
  const url = `${process.env.TMDB_BASE_URL}/search/multi?query=${query}&include_adult=false&language=en-US&page=1`
  return fetch(url, options)
}

export async function getTrending(
  type: "movie"
): Promise<TrendingResults<"movie">>
export async function getTrending(type: "tv"): Promise<TrendingResults<"tv">>
export async function getTrending(type: "movie" | "tv") {
  const url = `${process.env.TMDB_BASE_URL}/trending/${type}/day`
  const res = await fetch(url, options)
  const data = await res.json()
  return data
}

export async function getDetails(
  type: "movie",
  id: string
): Promise<MovieDetails>
export async function getDetails(type: "tv", id: string): Promise<TvShowDetails>
export async function getDetails(type: "movie" | "tv", id: string) {
  const url = `${process.env.TMDB_BASE_URL}/${type}/${id}`
  const res = await fetch(url, options)
  const data = await res.json()
  return data
}

export async function getRecommendations(
  type: "movie",
  id: string
): Promise<Recommendations>
export async function getRecommendations(
  type: "tv",
  id: string
): Promise<TvRecommendations>
export async function getRecommendations(type: "movie" | "tv", id: string) {
  const url = `${process.env.TMDB_BASE_URL}/${type}/${id}/recommendations`
  const res = await fetch(url, options)
  const data = await res.json()
  return data
}

export async function getByGenre(
  type: "movie",
  genreId: string,
  page: number
): Promise<MovieDiscoverResult>
export async function getByGenre(
  type: "tv",
  genreId: string,
  page: number
): Promise<TvShowDiscoverResult>
export async function getByGenre(
  type: "tv" | "movie",
  genreId: string,
  page: number
) {
  const url = `${process.env.TMDB_BASE_URL}/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
  const res = await fetch(url, options)
  const data = await res.json()
  return data
}
