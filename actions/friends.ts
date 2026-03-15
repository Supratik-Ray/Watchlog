"use server"

import { friendshipsTable, notificationsTable } from "@/db/schema"
import { db } from "@/lib/db"
import { pusher } from "@/lib/pusher/server"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

export async function SendFriendRequest(receiverId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, message: "unauthorized!" }

    const [friendship] = await db
      .insert(friendshipsTable)
      .values({
        senderId: userId,
        receiverId,
      })
      .returning()

    const [notification] = await db
      .insert(notificationsTable)
      .values({
        notificationType: "friend_request",
        referenceId: friendship.id,
        userId: receiverId,
      })
      .returning()

    await pusher.trigger(`private-user-${receiverId}`, "notification", {
      id: notification.id,
      type: "friend_request",
      senderId: userId,
    })
    return { success: true, message: "Sent friend request!" }
  } catch (error) {
    return { success: false, message: "Couldn't send friend request!" }
  }
}

export type FriendshipStatus = "pending" | "accepted" | "rejected"

export async function updateFriendshipStatus(
  status: FriendshipStatus,
  friendShipId: string
) {
  try {
    await db
      .update(friendshipsTable)
      .set({ status })
      .where(eq(friendshipsTable.id, friendShipId))

    return {
      success: true,
      message:
        status === "accepted"
          ? "Friend request accepted!"
          : "Friend request rejected",
    }
  } catch (error) {
    return { success: false, message: "Error updating friendship status!" }
  }
}

export async function removeFriend(friendshipId: string) {
  try {
    await db
      .delete(friendshipsTable)
      .where(eq(friendshipsTable.id, friendshipId))
  } catch (error) {}
}
