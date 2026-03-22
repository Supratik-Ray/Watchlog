import { auth } from "@clerk/nextjs/server"
import { Card } from "../ui/card"
import MediaActions from "./MediaActions"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { watchlistTable } from "@/db/schema"
import { ReactElement } from "react"
import { MediaDetails } from "@/types/types"
import RecommendButton from "./RecommendButton"

export default async function MediaActionArea({
  mediaId,
  mediaType,
  mediaTitle,
  mediaPoster,
}: MediaDetails) {
  let content: ReactElement
  const { userId } = await auth()

  if (!userId) {
    content = (
      <p className="text-center text-muted-foreground">
        Login to add to watchlist!
      </p>
    )
  } else {
    const watchItem = await db.query.watchlistTable.findFirst({
      where: and(
        eq(watchlistTable.mediaId, mediaId),
        eq(watchlistTable.userId, userId)
      ),
    })

    if (watchItem) {
      content = (
        <>
          <p className="text-center text-muted-foreground">
            You already added to watchlist!
          </p>
          <RecommendButton
            media={{ mediaId, mediaTitle, mediaType, mediaPoster }}
          />
        </>
      )
    } else {
      content = (
        <MediaActions
          mediaDetails={{
            mediaId,
            mediaType,
            mediaTitle,
            mediaPoster,
          }}
        />
      )
    }
  }
  return <Card className="flex flex-1 justify-center p-8">{content}</Card>
}
