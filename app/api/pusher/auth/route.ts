import { auth } from "@clerk/nextjs/server"
import { pusher } from "@/lib/pusher/server"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  const body = await request.text()
  const params = new URLSearchParams(body)
  const socketId = params.get("socket_id")!
  const channel = params.get("channel_name")!

  if (channel !== `private-user-${userId}`) {
    return new Response("Forbidden", { status: 403 })
  }

  const authResponse = pusher.authorizeChannel(socketId, channel)
  return Response.json(authResponse)
}
