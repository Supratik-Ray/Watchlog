import Link from "next/link"
import React from "react"
import { Card } from "./ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"

export default function PosterCard({ type, item }) {
  return (
    <Link href={`/${type}/${item.id}`} key={item.id}>
      <Card className="p-0">
        <Image
          src={getImageUrl(item.poster_path, "w342")}
          alt={item.name}
          width={342}
          height={513}
          className="h-100 w-80"
        />
      </Card>
    </Link>
  )
}
