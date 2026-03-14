"use client"

import { Button } from "@/components/ui/button"
import {
  PaperPlaneIcon,
  PaperPlaneRightIcon,
  PlusIcon,
} from "@phosphor-icons/react"

export default function MovieActions() {
  return (
    <>
      <Button className="cursor-pointer" size="lg">
        <PlusIcon />
        Add to my list
      </Button>
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
