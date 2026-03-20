import { WatchStatus } from "@/actions/watchlist"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function useSelectMediaStatus() {
  const [status, setStatus] = useState<WatchStatus>("plan_to_watch")
  const [rating, setRating] = useState<number>(1)
  const dropdownContent = (
    <>
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
      {status === "watched" && (
        <Select
          value={`${rating}`}
          onValueChange={(value) => setRating(+value)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rating</SelectLabel>
              {Array.from({ length: 10 }).map((_, i) => (
                <SelectItem key={i} value={`${i + 1}`}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </>
  )

  return [dropdownContent, status, rating] as const
}
