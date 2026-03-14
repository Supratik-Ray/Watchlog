"use client"

import Link from "next/link"
import { Input } from "./ui/input"
import { BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { NormalizedMedia } from "@/types/normalized"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { Spinner } from "./ui/spinner"

export default function SearchNavbar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NormalizedMedia[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setResults([])
        const res = await fetch(`/api/search?query=${query}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data)
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

  console.log(results)

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between px-8 py-4">
        {/* left side */}
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-primary">WatchLog</span>
          <Link href="/home">Home</Link>
          <Link href="/watchlist">My List</Link>
          <Link href="/friends">Friends</Link>
        </div>
        {/* right side */}
        <div className="flex items-center gap-8">
          {/* searchbar */}
          <div className="relative">
            <div className="relative w-100">
              <MagnifyingGlassIcon
                className="absolute top-1/2 left-3 -translate-y-1/2"
                size={20}
              />
              <Input
                placeholder="search titles"
                className="w-full py-5 pl-10"
                onChange={(e) => setQuery(e.target.value.trim())}
              />
            </div>
            {loading && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-popover p-5 shadow-md">
                <Spinner className="mx-auto size-7" />
              </div>
            )}
            {results.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
                {results.slice(0, 5).map((result) => (
                  <div
                    key={result.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                  >
                    <Image
                      src={getImageUrl(result.posterPath, "w92")}
                      width={40}
                      height={60}
                      alt={result.title}
                      className="h-15 w-10 rounded-sm object-cover"
                    />

                    <span className="text-sm">{result.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <span>
            <BellIcon size={23} />
          </span>
        </div>
      </nav>
    </header>
  )
}
