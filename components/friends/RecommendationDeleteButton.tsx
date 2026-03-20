"use client"
import { deleteRecommendation } from "@/actions/recommendation"
import { TrashIcon } from "@phosphor-icons/react"
import { useState, useTransition } from "react"
import toast, { Toaster } from "react-hot-toast"

//modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

export default function RecommendationDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function handleDeleteRecommendation() {
    startTransition(async () => {
      try {
        const res = await deleteRecommendation(id)
        if (res.success) {
          toast.success(res.message)
        } else {
          toast.error(res.message)
        }
      } catch (error) {
        toast.error("Network issue!. Please try again later")
      } finally {
        setOpen(false)
      }
    })
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <TrashIcon size={20} color="red" className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              recommendation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteRecommendation}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-1">
                  Deleting <Spinner fontSize={24} />
                </span>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
