import SectionHeader from "../SectionHeader"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { recommendationsTable } from "@/db/schema"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Link from "next/link"
import RecommendationDeleteButton from "./RecommendationDeleteButton"

export default async function FriendRecommendations() {
  const { userId } = await auth()
  if (!userId) throw new Error("User not authorized")

  const recommendations = await db.query.recommendationsTable.findMany({
    where: eq(recommendationsTable.receiverId, userId),
  })

  const client = await clerkClient()

  const recommendationsWithUserInfo = await Promise.all(
    recommendations.map(async (recommendation) => {
      const friend = await client.users.getUser(recommendation.senderId)
      return { ...recommendation, friend }
    })
  )

  const totalRecommendations = recommendationsWithUserInfo.length

  return (
    <section className="mb-10">
      <SectionHeader>Recommendations from friends</SectionHeader>
      {totalRecommendations === 0 ? (
        <p className="text-sm text-muted-foreground">
          No recommendations from friends yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendationsWithUserInfo.map((recommendation) => (
            <Card key={recommendation.id} className="overflow-hidden p-0">
              <div className="flex h-full">
                <div className="w-24 shrink-0 sm:w-32">
                  <Image
                    src={getImageUrl(recommendation.mediaPoster, "w300")}
                    width={150}
                    height={300}
                    alt={recommendation.mediaTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="shrink-0">
                        {recommendation.mediaType}
                      </Badge>
                      <RecommendationDeleteButton id={recommendation.id} />
                    </div>
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {recommendation.mediaTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From {recommendation.friend.firstName}{" "}
                      {recommendation.friend.lastName}
                    </p>
                  </div>
                  <Link
                    href={`/${recommendation.mediaType}/${recommendation.mediaId}`}
                    className="mt-3"
                  >
                    <Button size="sm" className="w-full cursor-pointer">
                      View details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
