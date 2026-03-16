import { friendshipsTable } from "@/db/schema"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { and, eq, or } from "drizzle-orm"
import { Button } from "../ui/button"
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr"
import AddFriendRequestButton from "./AddFriendRequestButton"
import FriendRequestActions from "./FriendRequestActions"

//TODO:move friends/friendID to users/userId

export default async function UserProfileActions({
  profileId,
}: {
  profileId: string
}) {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthenticated user!")

  //get friendship entry if exists
  const friendship = await db.query.friendshipsTable.findFirst({
    where: or(
      and(
        eq(friendshipsTable.senderId, userId),
        eq(friendshipsTable.receiverId, profileId)
      ),
      and(
        eq(friendshipsTable.senderId, profileId),
        eq(friendshipsTable.receiverId, userId)
      )
    ),
  })

  if (!friendship) {
    return <AddFriendRequestButton friendId={profileId} />
  }

  if (friendship.status === "accepted") {
    return (
      <Button className="bg-green-600 p-3 hover:bg-green-600">
        <CheckCircleIcon size={23} /> Friends
      </Button>
    )
  }

  if (friendship.senderId === userId) {
    return (
      <Button disabled>
        <CheckCircleIcon size={20} /> Sent
      </Button>
    )
  }

  if (friendship.receiverId === userId) {
    return (
      <div className="flex gap-4">
        <FriendRequestActions friendshipId={friendship.id} />
      </div>
    )
  }
}
