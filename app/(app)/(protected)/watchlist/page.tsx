import { DataTable } from "@/components/watchlist/data-table"
import { columns } from "@/components/watchlist/columns"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { watchlistTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function WatchlistPage() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const data = await db.query.watchlistTable.findMany({
    where: eq(watchlistTable.userId, userId),
  })

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
