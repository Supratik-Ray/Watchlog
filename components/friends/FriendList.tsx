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
import { ArrowSquareOutIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr"
import { db } from "@/lib/db"
import { and, eq, or } from "drizzle-orm"
import { friendshipsTable } from "@/db/schema"
import { auth, clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import FriendAction from "./FriendAction"

export default async function FriendList() {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized to access")

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

  const totalFriends = friendshipsWithFriends.length

  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Your Friends ({totalFriends})</SectionHeader>
      <div className="flex flex-col gap-4">
        {totalFriends === 0 && (
          <p className="text-muted-foreground">
            No friends yet. Start adding some!
          </p>
        )}
        {friendshipsWithFriends.map((friendship) => {
          return (
            <Card key={friendship.friend.id}>
              <div className="flex items-center justify-between px-10">
                <div className="flex flex-1 items-center">
                  <Avatar size="lg">
                    <AvatarImage src={friendship.friend.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <CardHeader className="flex-1">
                    <CardTitle>{friendship.friend.fullName}</CardTitle>
                    <CardDescription>
                      {friendship.friend.username
                        ? `@${friendship.friend.username}`
                        : "@no-username"}
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardFooter className="flex gap-4">
                  <Button size="sm" className="cursor-pointer" asChild>
                    <Link href={`friends/${friendship.friend.id}`}>
                      <ArrowSquareOutIcon size={20} />
                      Profile
                    </Link>
                  </Button>
                  <FriendAction friendshipId={friendship.id} />
                </CardFooter>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
