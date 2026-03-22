import SectionHeader from "../SectionHeader"
import { Card } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr"
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
      const friendId =
        friendship.receiverId === userId
          ? friendship.senderId
          : friendship.receiverId
      const friend = await client.users.getUser(friendId)
      return { ...friendship, friend }
    })
  )

  const totalFriends = friendshipsWithFriends.length

  return (
    <section className="mb-10">
      <SectionHeader>Your Friends ({totalFriends})</SectionHeader>
      {totalFriends === 0 ? (
        <p className="text-sm text-muted-foreground">
          No friends yet. Start adding some!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {friendshipsWithFriends.map((friendship) => (
            <Card key={friendship.friend.id}>
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage src={friendship.friend.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {friendship.friend.fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {friendship.friend.username
                        ? `@${friendship.friend.username}`
                        : "@no-username"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <Button
                    size="sm"
                    className="flex-1 cursor-pointer sm:flex-none"
                    asChild
                  >
                    <Link href={`friends/${friendship.friend.id}`}>
                      <ArrowSquareOutIcon size={16} />
                      Profile
                    </Link>
                  </Button>
                  <FriendAction friendshipId={friendship.id} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
