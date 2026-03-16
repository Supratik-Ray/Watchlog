"use server"

import { friendshipsTable, notificationsTable } from "@/db/schema"
import { db } from "@/lib/db"
import { pusher } from "@/lib/pusher/server"
import { auth } from "@clerk/nextjs/server"
import { and, eq, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function SendFriendRequest(receiverId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, message: "unauthorized!" }

    // check if friendship already exists in either direction
    const existing = await db
      .select()
      .from(friendshipsTable)
      .where(
        or(
          and(
            eq(friendshipsTable.senderId, userId),
            eq(friendshipsTable.receiverId, receiverId)
          ),
          and(
            eq(friendshipsTable.senderId, receiverId),
            eq(friendshipsTable.receiverId, userId)
          )
        )
      )
      .limit(1)

    if (existing.length > 0)
      return { success: false, message: "Friend request already exists" }

    //insert into friendship table
    const [friendship] = await db
      .insert(friendshipsTable)
      .values({
        senderId: userId,
        receiverId,
      })
      .returning()

    //insert into notification table
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        notificationType: "friend_request",
        referenceId: friendship.id,
        userId: receiverId,
      })
      .returning()

    //dispatch nofification to the receiver
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

    revalidatePath("/friends")

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

    revalidatePath("/friends")

    return { success: true, message: "removed user from friends successfully!" }
  } catch (error) {
    return {
      success: false,
      message: "error removing user from friends!",
    }
  }
}
