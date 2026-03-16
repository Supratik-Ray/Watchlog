"use client"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { useTransition } from "react"
import { updateFriendshipStatus } from "@/actions/friends"
import toast from "react-hot-toast"

export default function FriendRequestActions({
  friendshipId,
}: {
  friendshipId: string
}) {
  const [isPending, startTransition] = useTransition()
  function handleUpdateFriendshipStatus(status: "accepted" | "rejected") {
    startTransition(() => {
      toast.promise(updateFriendshipStatus(status, friendshipId), {
        loading: status === "accepted" ? "Accepting..." : "Rejecting...",
        success:
          status === "accepted"
            ? "Friend request accepted"
            : "Friend request rejected",
        error: "Something went wrong",
      })
    })
  }
  return (
    <>
      <Button
        className="cursor-pointer bg-green-600 hover:bg-green-800"
        onClick={() => handleUpdateFriendshipStatus("accepted")}
        disabled={isPending}
      >
        <CheckCircleIcon size={20} />
        Accept
      </Button>
      <Button
        variant="destructive"
        className="cursor-pointer"
        onClick={() => handleUpdateFriendshipStatus("rejected")}
        disabled={isPending}
      >
        <XCircleIcon size={20} />
        Reject
      </Button>
    </>
  )
}
