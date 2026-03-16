import Image from "next/image"
import SectionHeader from "../SectionHeader"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react/dist/ssr"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { friendshipsTable } from "@/db/schema"
import { auth, clerkClient } from "@clerk/nextjs/server"
import FriendRequestActions from "./FriendRequestActions"

export default async function FriendRequests() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unathorized to access")
  }

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
    <section className="container mx-auto mb-12">
      <SectionHeader>Friend Requests ({totalFriendRequests})</SectionHeader>
      {totalFriendRequests === 0 && (
        <p className="text-muted-foreground">No available friend requests!</p>
      )}
      <div className="grid grid-cols-4 gap-4">
        {friendRequestsWithUser.map((req) => {
          return (
            <Card key={req.id}>
              <CardHeader>
                <div className="flex justify-center">
                  <Avatar size="lg">
                    <AvatarImage src={req.user.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">
                  {req.user.fullName}
                </CardTitle>
                <CardDescription className="text-center">
                  {req.user.username ?? "@no-username"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center gap-4">
                <FriendRequestActions friendshipId={req.id} />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
