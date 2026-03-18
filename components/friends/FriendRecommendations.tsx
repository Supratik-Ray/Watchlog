import SectionHeader from "../SectionHeader"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { recommendationsTable } from "@/db/schema"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { ReceiptIcon } from "@phosphor-icons/react"
import { Badge } from "../ui/badge"
import { TrashIcon } from "@phosphor-icons/react/dist/ssr"
import { Button } from "../ui/button"
import Link from "next/link"

export default async function FriendRecommendations() {
  const { userId } = await auth()
  if (!userId) throw new Error("User not authorized")

  //get all recommendations from friends for current user
  const recommendations = await db.query.recommendationsTable.findMany({
    where: eq(recommendationsTable.receiverId, userId),
  })

  //fetch userInfo for recommendation sender

  const client = await clerkClient()

  const recommendationsWithUserInfo = await Promise.all(
    recommendations.map(async (recommendation) => {
      const friend = await client.users.getUser(recommendation.senderId)
      return { ...recommendation, friend }
    })
  )

  const totalRecommendations = recommendationsWithUserInfo.length
  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Recommendations from friends</SectionHeader>
      {totalRecommendations === 0 ? (
        <p className="text-muted-foreground">
          No available recommendations from friends.
        </p>
      ) : (
        <div className="grid grid-cols-3">
          {recommendationsWithUserInfo.map((recommendation) => (
            <Card key={recommendation.id} className="p-0">
              <div className="flex">
                <div>
                  <Image
                    src={getImageUrl(recommendation.mediaPoster, "w300")}
                    width={150}
                    height={300}
                    alt={recommendation.mediaTitle}
                  />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <CardHeader className="block flex-1 gap-0 p-0">
                    <div className="mb-2 flex justify-between">
                      <Badge>{recommendation.mediaType}</Badge>
                      <span>
                        <TrashIcon size={20} color="red" />
                      </span>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {recommendation.mediaTitle}
                      </CardTitle>
                      <CardDescription>
                        Sent by
                        {recommendation.friend.firstName +
                          " " +
                          recommendation.friend.lastName}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-0">
                    <Link
                      href={`/${recommendation.mediaType}/${recommendation.mediaId}`}
                    >
                      <Button className="w-full cursor-pointer">
                        View details
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
