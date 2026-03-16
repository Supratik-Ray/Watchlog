import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) return Response.json([])

  const client = await clerkClient()

  const { data } = await client.users.getUserList({ query, limit: 5 })

  const users = data
    .filter((user) => user.id !== userId)
    .map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      imageUrl: user.imageUrl,
    }))

  return Response.json(users)
}
