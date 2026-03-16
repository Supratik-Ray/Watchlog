"use client"
import { Button } from "../ui/button"
import {
  CheckCircleIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { SendFriendRequest } from "@/actions/friends"
import toast from "react-hot-toast"

export default function AddFriendRequest({ friendId }: { friendId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleAddFriend() {
    startTransition(async () => {
      const res = await SendFriendRequest(friendId)
      setOpen(false)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <UserPlusIcon size={20} />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send friend request?</DialogTitle>
          <DialogDescription>
            The requested user will be notified of your friend request.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <Button className="cursor-pointer" onClick={handleAddFriend}>
            <CheckCircleIcon size={20} /> {isPending ? "Sending..." : "Send"}
          </Button>

          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <XCircleIcon size={20} /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
