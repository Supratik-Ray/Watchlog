"use client"

import { useTransition } from "react"
import { Button } from "../ui/button"
import { TrashIcon } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { removeFriend } from "@/actions/friends"

export default function FriendAction({
  friendshipId,
}: {
  friendshipId: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleRemoveFriend() {
    startTransition(async () => {
      toast.promise(removeFriend(friendshipId), {
        loading: "Removing user...",
        success: "Successfully removed user!",
        error: "error removing user!",
      })
    })
  }
  return (
    <Button
      variant="destructive"
      className="cursor-pointer"
      disabled={isPending}
      onClick={handleRemoveFriend}
    >
      <TrashIcon size={20} />
      Remove
    </Button>
  )
}
