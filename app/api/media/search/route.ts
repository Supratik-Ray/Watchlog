import { NormalizedMedia } from "@/types/normalized"
import { TMDBMediaItem } from "@/types/tmdb"
import { normalizeMedia } from "@/lib/normalizeMedia"
import { NextRequest } from "next/server"
import { getMultiSearchResult } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return Response.json({ error: "query is required!" }, { status: 400 })
  }

  const res = await getMultiSearchResult(query)
  const data = await res.json()

  const normalized: NormalizedMedia[] = data.results
    .filter(
      (item: TMDBMediaItem) =>
        item.media_type === "movie" || item.media_type === "tv"
    )
    .map(normalizeMedia)

  return Response.json(normalized)
}
