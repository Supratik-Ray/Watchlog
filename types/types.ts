import { WatchData } from "@/actions/watchlist"

export type MediaDetails = Omit<WatchData, "status" | "rating">

export type Friendship = {
  id: string
  receiverId: string
  senderId: string
  status: "pending" | "accepted" | "rejected"
  friend: {
    id: string
    imageUrl: string
    firstName: string
    lastName: string
    username: string
  }
}
