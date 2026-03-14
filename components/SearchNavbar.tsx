"use client"

import Link from "next/link"
import { Input } from "./ui/input"
import { BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { NormalizedMedia } from "@/types/normalized"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export default function SearchNavbar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NormalizedMedia[]>([])
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    function handleConfirmSearch(e: KeyboardEvent) {
      if (
        e.key === "Enter" &&
        document.activeElement === searchInputRef.current
      ) {
        setResults([])
        controllerRef.current?.abort()
        router.push(`/search?query=${query}`)
      }
    }

    document.addEventListener("keydown", handleConfirmSearch)

    return () => document.removeEventListener("keydown", handleConfirmSearch)
  }, [query, controllerRef, router])

  useEffect(() => {
    function handleClearResults() {
      controllerRef.current?.abort()
      setResults([])
    }
    document.addEventListener("click", handleClearResults)

    return () => removeEventListener("click", handleClearResults)
  }, [controllerRef])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    controllerRef.current = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setResults([])
        const res = await fetch(`/api/search?query=${query}`, {
          signal: controllerRef.current?.signal,
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
      controllerRef.current?.abort()
    }
  }, [query, controllerRef])

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
                onChange={(e) => setQuery(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            {loading && (
              <div className="absolute top-full left-0 z-100 mt-2 w-full rounded-md border bg-popover p-5 shadow-md">
                <Spinner className="mx-auto size-7" />
              </div>
            )}
            {results.length > 0 && (
              <div className="absolute top-full left-0 z-100 mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
                {results.slice(0, 5).map((result) => (
                  <Link
                    href={`/${result.mediaType}/${result.id}`}
                    key={result.id}
                  >
                    <div className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted">
                      <Image
                        src={getImageUrl(result.posterPath, "w92")}
                        width={40}
                        height={60}
                        alt={result.title}
                        className="h-15 w-10 rounded-sm object-cover"
                      />

                      <span className="text-sm">{result.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <span>
            <BellIcon size={23} />
          </span>
          {/* clerk auth components */}
          <div>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="ml-4 h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>
    </header>
  )
}
