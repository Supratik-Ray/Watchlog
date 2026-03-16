import { friendshipsTable } from "@/db/schema"
import { db } from "@/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { and, eq, or } from "drizzle-orm"
import { NextRequest } from "next/server"
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  //TODO: refactor this into a function (duplicate in friendlist component)
  const friendships = await db.query.friendshipsTable.findMany({
    where: and(
      or(
        eq(friendshipsTable.senderId, userId),
        eq(friendshipsTable.receiverId, userId)
      ),
      eq(friendshipsTable.status, "accepted")
    ),
  })

  const client = await clerkClient()

  const friendshipsWithFriends = await Promise.all(
    friendships.map(async (friendship) => {
      let friendId: string
      if (friendship.receiverId === userId) {
        friendId = friendship.senderId
      } else {
        friendId = friendship.receiverId
      }

      const friend = await client.users.getUser(friendId)
      return { ...friendship, friend }
    })
  )

  return Response.json(friendshipsWithFriends)
}
