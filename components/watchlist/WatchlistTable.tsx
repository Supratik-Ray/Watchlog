"use client"
import { DataTable } from "@/components/watchlist/data-table"
import { getColumns } from "@/components/watchlist/columns"
import { WatchListItem } from "@/db/schema"
export default function WatchlistTable({
  data,
  hideActions,
}: {
  data: WatchListItem[]
  hideActions: boolean
}) {
  return <DataTable columns={getColumns(hideActions)} data={data} />
}
