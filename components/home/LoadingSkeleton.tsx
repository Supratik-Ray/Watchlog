import { Skeleton } from "../ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-100 w-full" />
      ))}
    </>
  )
}
