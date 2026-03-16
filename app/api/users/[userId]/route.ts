import { clerkClient } from "@clerk/nextjs/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  return Response.json({
    id: user.id,
    username: user.username,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
  })
}
