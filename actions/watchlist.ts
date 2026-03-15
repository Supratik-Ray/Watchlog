"use server"

import { watchlistTable } from "@/db/schema"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export type WatchStatus = "plan_to_watch" | "watching" | "watched"

export type WatchData = {
  mediaId: string
  mediaType: "movie" | "tv"
  mediaTitle: string
  mediaPoster: string | undefined
  status: WatchStatus
}

export async function addToWatchList(watchData: WatchData) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, message: "Unauthorized!" }
    await db.insert(watchlistTable).values({ ...watchData, userId })
    return { success: true, message: "Successfully added to watchlist!" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Failed to add to watchlist!" }
  }
}
