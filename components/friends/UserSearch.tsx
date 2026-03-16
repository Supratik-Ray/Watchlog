"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { Card } from "../ui/card"
import SectionHeader from "../SectionHeader"

export default function UserSearch() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/users/search?query=${query}`, {
          signal: controller.signal,
        })
        const data = await res.json()

        console.log(data)
        setUsers(data)
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
      controller.abort()
    }
  }, [query])

  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Discover new friends</SectionHeader>
      <Card className="flex items-center justify-center p-8">
        <div className="relative mb-2">
          <div className="relative w-100">
            <MagnifyingGlassIcon
              className="absolute top-1/2 left-3 -translate-y-1/2"
              size={20}
            />
            <Input
              value={query}
              placeholder="search by name or username"
              className="w-full py-5 pl-10"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter a name or username to find other movie lovers on watchlog
        </p>
      </Card>
    </section>
  )
}
