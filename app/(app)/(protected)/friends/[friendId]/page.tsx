import { db } from "@/lib/db"
import { watchlistTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import WatchlistTable from "@/components/watchlist/WatchlistTable"
import { clerkClient } from "@clerk/nextjs/server"
import SectionHeader from "@/components/SectionHeader"
import { Card, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserProfileActions from "@/components/friends/UserProfileActions"
import { Suspense } from "react"

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
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <section className="container mx-auto mb-12">
        <SectionHeader>Profile</SectionHeader>
        <Card>
          <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center sm:gap-0 sm:p-0">
            <div className="sm:p-8">
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
            <div className="flex-1 self-center text-center sm:text-left">
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {user.username ? `@${user.username}` : "@no-username"}
              </p>
            </div>
            <CardFooter className="p-0 sm:p-6">
              <Suspense fallback={"Loading..."}>
                <UserProfileActions profileId={friendId} />
              </Suspense>
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
