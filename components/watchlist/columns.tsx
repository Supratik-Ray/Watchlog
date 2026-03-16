"use client"

import { WatchListItem } from "@/db/schema"
import { getImageUrl } from "@/lib/getImageUrl"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsThreeIcon } from "@phosphor-icons/react"

export function getColumns(hideactions = false): ColumnDef<WatchListItem>[] {
  const base: ColumnDef<WatchListItem>[] = [
    {
      accessorKey: "mediaPoster",
      header: "Poster",
      cell: ({ row }) => {
        return (
          <Image
            src={getImageUrl(row.getValue("mediaPoster"), "w92")}
            alt={row.getValue("mediaTitle")}
            width={40}
            height={60}
            className="rounded-sm object-cover"
          />
        )
      },
    },
    {
      accessorKey: "mediaTitle",
      header: "Title",
    },
    {
      accessorKey: "mediaType",
      header: "Type",
      cell: ({ row }) => {
        return (
          <span className="rounded-full bg-primary px-2 py-1 text-xs capitalize">
            {row.getValue("mediaType") === "tv" ? "tv show" : "movie"}
          </span>
        )
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number | null
        return <span>{rating ?? "—"}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        let style = "bg-card text-white"
        if (status === "watching") {
          style =
            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        }
        if (status === "watched") {
          style = "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
        }
        return (
          <Badge className={cn("capitalize", style)}>
            {status.replace(/_/g, " ")}
          </Badge>
        )
      },
    },
  ]

  if (hideactions) return base

  return [
    ...base,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsThreeIcon size={23} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
