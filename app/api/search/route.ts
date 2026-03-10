import { NormalizedMedia } from "@/types/normalized"
import { TMDBMediaItem } from "@/types/tmdb"
import { normalizeMedia } from "@/utils/normalizeMedia"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return Response.json({ error: "query is required!" }, { status: 400 })
  }

  const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  }

  const res = await fetch(url, options)
  const data = await res.json()

  const normalized: NormalizedMedia[] = data.results
    .filter(
      (item: TMDBMediaItem) =>
        item.media_type === "movie" || item.media_type === "tv"
    )
    .map(normalizeMedia)

  return Response.json(normalized)
}
