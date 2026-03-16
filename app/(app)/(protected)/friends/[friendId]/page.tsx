import { db } from "@/lib/db"
import { watchlistTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import WatchlistTable from "@/components/watchlist/WatchlistTable"
import { clerkClient } from "@clerk/nextjs/server"
import SectionHeader from "@/components/SectionHeader"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddFriendRequest from "@/components/friends/AddFriendRequest"

//TODO: later separate out watchlist and user data fetching into different components

export default async function FriendProfile({
  params,
}: {
  params: Promise<{ friendId: string }>
}) {
  const { friendId } = await params
  const data = await db.query.watchlistTable.findMany({
    where: eq(watchlistTable.userId, friendId),
  })

  const client = await clerkClient()
  const user = await client.users.getUser(friendId)

  return (
    <div className="py-10">
      <section className="container mx-auto mb-12">
        <SectionHeader>Profile</SectionHeader>
        <Card>
          <div className="flex items-center">
            <div className="p-8">
              <Avatar size="xxl">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>
                  {user.fullName
                    ?.split(" ")
                    .map((word) => word[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardHeader className="flex-1">
              <CardTitle>{user.fullName}</CardTitle>
              <CardDescription>
                {user.username ? `@${user.username}` : "@no-username"}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AddFriendRequest friendId={friendId} />
            </CardFooter>
          </div>
        </Card>
      </section>
      <section className="container mx-auto">
        <SectionHeader>WatchList</SectionHeader>
        <WatchlistTable data={data} hideActions={true} />
      </section>
    </div>
  )
}
