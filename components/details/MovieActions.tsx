"use client"

import { Button } from "@/components/ui/button"
import { PaperPlaneRightIcon, PlusIcon } from "@phosphor-icons/react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addToWatchList, WatchData, WatchStatus } from "@/actions/watchlist"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"

type MediaDetails = Omit<WatchData, "status">

export default function MovieActions({
  mediaDetails,
}: {
  mediaDetails: MediaDetails
}) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<WatchStatus>("plan_to_watch")

  function handleAdd() {
    startTransition(async () => {
      const result = await addToWatchList({ ...mediaDetails, status })

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
      <Dialog open={open} onOpenChange={setOpen}>
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
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as WatchStatus)}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="plan_to_watch">Plan to watch</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={isPending}>
            {isPending ? "Adding..." : "Add to List"}
          </Button>
        </DialogContent>
      </Dialog>
      <Button
        variant="ghost"
        className="cursor-pointer border-2 border-chart-3 text-chart-3 hover:text-chart-3"
        size="lg"
      >
        <PaperPlaneRightIcon className="text-chart-3" /> Recommend to a friend
      </Button>
    </>
  )
}
