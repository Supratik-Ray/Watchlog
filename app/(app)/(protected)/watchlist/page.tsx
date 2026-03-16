import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { watchlistTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import WatchlistTable from "@/components/watchlist/WatchlistTable"

export default async function WatchlistPage() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const data = await db.query.watchlistTable.findMany({
    where: eq(watchlistTable.userId, userId),
  })

  return (
    <div className="container mx-auto py-10">
      <WatchlistTable data={data} hideActions={false} />
    </div>
  )
}
