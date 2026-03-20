"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "@phosphor-icons/react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { addToWatchlist } from "@/actions/watchlist"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"
import RecommendButton from "./RecommendButton"
import { MediaDetails } from "@/types/types"
import useSelectMediaStatus from "../../hooks/useSelectMediaStatus"

export default function MediaActions({
  mediaDetails,
}: {
  mediaDetails: MediaDetails
}) {
  const { dropdownContent, status, rating, reset } = useSelectMediaStatus()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function handleAdd() {
    startTransition(async () => {
      const result = await addToWatchlist({
        ...mediaDetails,
        status,
        rating: status === "watched" ? rating : null,
      })

      setOpen(false)

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            reset()
          }
          setOpen(open)
        }}
      >
        <Button
          className="cursor-pointer"
          size="lg"
          onClick={() => setOpen(true)}
        >
          <PlusIcon />
          Add to my list
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Watch Status</DialogTitle>
          </DialogHeader>
          {dropdownContent}
          <Button onClick={handleAdd} disabled={isPending}>
            {isPending ? "Adding..." : "Add to List"}
          </Button>
        </DialogContent>
      </Dialog>
      <RecommendButton media={mediaDetails} />
    </>
  )
}
