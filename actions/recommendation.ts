"use server"
import { notificationsTable, recommendationsTable } from "@/db/schema"
import { db } from "@/lib/db"
import { pusher } from "@/lib/pusher/server"
import { MediaDetails } from "@/types/types"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type SendRecommendationInput = {
  friends: string[]
  media: MediaDetails
}

export async function sendRecommendation(data: SendRecommendationInput) {
  const { userId } = await auth()

  if (!userId) throw new Error("unauthenticated user")

  //create recommendation entries for each friend

  const [recommendationEntries] = await Promise.all(
    data.friends.map((friend) =>
      db
        .insert(recommendationsTable)
        .values({ senderId: userId, receiverId: friend, ...data.media })
        .returning()
    )
  )

  //create notification entries for each user
  const [notificationEntries] = await Promise.all(
    recommendationEntries.map((entry) =>
      db
        .insert(notificationsTable)
        .values({
          notificationType: "recommendation",
          userId: entry.receiverId,
          referenceId: entry.id,
        })
        .returning()
    )
  )

  //sending realtime notification alerts to users
  await Promise.all(
    notificationEntries.map((entry) =>
      pusher.trigger(`private-user-${entry.userId}`, "notification", {
        id: entry.id,
        type: "recommendation",
        senderId: userId,
      })
    )
  )
}

export async function deleteRecommendation(recommendationId: string) {
  try {
    await db
      .delete(recommendationsTable)
      .where(eq(recommendationsTable.id, recommendationId))
    revalidatePath("/friends")
    return { success: true, message: "Successfully deleted recommendation" }
  } catch (error) {
    return { success: false, message: "Couldn't delete recommendation" }
  }
}
