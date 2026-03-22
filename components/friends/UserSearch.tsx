"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Input } from "../ui/input"
import { useEffect, useRef, useState } from "react"
import { Spinner } from "../ui/spinner"
import { Card } from "../ui/card"
import SectionHeader from "../SectionHeader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export type User = {
  id: string
  imageUrl: string
  name: string
  username: string | null
}

export default function UserSearch() {
  const [users, setUsers] = useState<User[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    function handleClearResults() {
      controllerRef.current?.abort()
      setUsers([])
      setHasSearched(false)
    }
    document.addEventListener("click", handleClearResults)
    return () => removeEventListener("click", handleClearResults)
  }, [controllerRef])

  useEffect(() => {
    if (!query) {
      setUsers([])
      setHasSearched(false)
      return
    }
    controllerRef.current = new AbortController()
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/users/search?query=${query}`, {
          signal: controllerRef.current?.signal,
        })
        const data: User[] = await res.json()
        setUsers(data)
        setHasSearched(true)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      controllerRef.current?.abort()
    }
  }, [query])

  return (
    <section className="mb-10">
      <SectionHeader>Discover new friends</SectionHeader>
      <Card className="overflow-visible p-6 sm:p-8">
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative">
            <MagnifyingGlassIcon
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              value={query}
              placeholder="Search by name or username..."
              className="w-full py-5 pl-10"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-popover p-5 shadow-md">
              <Spinner className="mx-auto size-7" />
            </div>
          )}

          {!loading && hasSearched && users.length === 0 && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-popover px-4 py-6 text-center shadow-md">
              <p className="text-sm text-muted-foreground">
                No users found for &lsquo;{query}&rsquo;
              </p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
              {users.map((user) => (
                <Link key={user.id} href={`/friends/${user.id}`}>
                  <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
                    <Avatar size="lg">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((w) => w[0].toUpperCase())
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.username ? `@${user.username}` : "@no-username"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Enter a name or username to find other movie lovers on Watchlog
        </p>
      </Card>
    </section>
  )
}
