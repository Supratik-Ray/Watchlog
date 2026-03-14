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

export function getTrending(type: "movie" | "tv") {
  const url = `${process.env.TMDB_BASE_URL}/trending/${type}/day`
  return fetch(url, options)
}

export function getDetails(type: "movie" | "tv", id: string) {
  const url = `${process.env.TMDB_BASE_URL}/${type}/${id}?append_to_response=recommendations`
  return fetch(url, options)
}

export function getRecommendations(type: "movie" | "tv", id: string) {
  const url = `${process.env.TMDB_BASE_URL}/${type}/${id}/recommendations`
  return fetch(url, options)
}
