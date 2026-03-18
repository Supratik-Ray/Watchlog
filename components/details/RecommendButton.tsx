"use client"

import { PaperPlaneRightIcon } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState, useTransition } from "react"
import toast from "react-hot-toast"
import { Spinner } from "../ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { MediaDetails, Friendship } from "@/types/types"
import { sendRecommendation } from "@/actions/recommendation"

export default function RecommendButton({ media }: { media: MediaDetails }) {
  const [open, setOpen] = useState(false)
  const [friendships, setFriendships] = useState<Friendship[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      try {
        await sendRecommendation({ friends: selectedFriends, media })
        setOpen(false)
        toast.success("Successfully sent recommendation!")
      } catch (error) {
        toast.error("Failed to send recommendation!")
      }
    })
  }

  useEffect(() => {
    //fetch friend list only when dialog open
    if (!open) return
    async function getFriends() {
      try {
        setLoading(true)
        const res = await fetch("/api/friends")
        const data = await res.json()
        setFriendships(data)
        console.log(data)
      } catch (error) {
        toast.error("Error fetching friends!")
      } finally {
        setLoading(false)
      }
    }
    getFriends()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="cursor-pointer border-2 border-chart-3 text-chart-3 hover:text-chart-3"
        size="lg"
      >
        <PaperPlaneRightIcon className="text-chart-3" /> Recommend to a friend
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select friends</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar flex h-75 flex-col gap-2 overflow-y-scroll">
          {loading && (
            <div className="flex flex-1 items-center justify-center">
              <Spinner className="size-10" />{" "}
            </div>
          )}
          {!loading && friendships.length === 0 && (
            <p className="text-muted-foreground">No friends yet!</p>
          )}
          {!loading &&
            friendships.length > 0 &&
            friendships.map((friendship) => {
              return (
                <div
                  key={friendship.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedFriends.includes(friendship.friend.id)}
                    onCheckedChange={(checked) =>
                      setSelectedFriends((prev) =>
                        checked
                          ? [...prev, friendship.friend.id]
                          : prev.filter((item) => item !== friendship.friend.id)
                      )
                    }
                  />
                  <Avatar size="lg">
                    <AvatarImage src={friendship.friend.imageUrl} />
                    <AvatarFallback>
                      {[friendship.friend.firstName, friendship.friend.lastName]
                        .map((word) => word[0].toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3>
                    {friendship.friend.firstName} {friendship.friend.lastName}
                  </h3>
                  <p className="text-muted-foreground">
                    {friendship.friend.username
                      ? `@${friendship.friend.username}`
                      : "@no-username"}
                  </p>
                </div>
              )
            })}
        </div>
        <DialogFooter>
          {/* <Button onClick={() => setOpen(false)} variant="destructive">
            Close
          </Button> */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
