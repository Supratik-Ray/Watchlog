"use server"

import { watchlistTable } from "@/db/schema"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type WatchStatus = "plan_to_watch" | "watching" | "watched"
export type WatchRating = number | null
export type WatchType = "movie" | "tv"

export type WatchData = {
  mediaId: string
  mediaType: WatchType
  mediaTitle: string
  mediaPoster: string | undefined
  rating: WatchRating
  status: WatchStatus
}

export async function addToWatchlist(watchData: WatchData) {
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
export async function updateWatchlistItem(
  updatePayload: Partial<WatchData>,
  id: string
) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, message: "Unauthorized!" }
    //if try to update to status other than watched , then also revert back rating to null
    await db
      .update(watchlistTable)
      .set({
        ...updatePayload,
        rating:
          updatePayload.status !== "watched" ? null : updatePayload.rating,
      })
      .where(eq(watchlistTable.id, id))
    revalidatePath("/watchlist")
    return { success: true, message: "Successfully updated item!" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Failed to update item!" }
  }
}
export async function deleteWatchlistItem(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, message: "Unauthorized!" }
    await db.delete(watchlistTable).where(eq(watchlistTable.id, id))
    revalidatePath("/watchlist")
    return { success: true, message: "Successfully deleted item!" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Failed to delete item!" }
  }
}
