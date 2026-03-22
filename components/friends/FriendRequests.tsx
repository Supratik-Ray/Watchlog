import SectionHeader from "../SectionHeader"
import { Card } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { friendshipsTable } from "@/db/schema"
import { auth, clerkClient } from "@clerk/nextjs/server"
import FriendRequestActions from "./FriendRequestActions"

export default async function FriendRequests() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized to access")

  const friendRequests = await db.query.friendshipsTable.findMany({
    where: and(
      eq(friendshipsTable.receiverId, userId),
      eq(friendshipsTable.status, "pending")
    ),
  })

  const friendRequestsWithUser = await Promise.all(
    friendRequests.map(async (req) => {
      const client = await clerkClient()
      const user = await client.users.getUser(req.senderId)
      return { ...req, user }
    })
  )

  const totalFriendRequests = friendRequestsWithUser.length

  return (
    <section className="mb-10">
      <SectionHeader>Friend Requests ({totalFriendRequests})</SectionHeader>
      {totalFriendRequests === 0 ? (
        <p className="text-sm text-muted-foreground">
          No pending friend requests.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {friendRequestsWithUser.map((req) => (
            <Card
              key={req.id}
              className="flex flex-col items-center p-4 text-center"
            >
              <Avatar size="lg" className="mb-3">
                <AvatarImage src={req.user.imageUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="mb-0.5 truncate text-sm font-semibold">
                {req.user.fullName}
              </p>
              <p className="mb-4 truncate text-xs text-muted-foreground">
                {req.user.username ?? "@no-username"}
              </p>
              <FriendRequestActions friendshipId={req.id} />
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
