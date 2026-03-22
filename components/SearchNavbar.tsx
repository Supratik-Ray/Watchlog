"use client"

import Link from "next/link"
import { Input } from "./ui/input"
import { MagnifyingGlassIcon, ListIcon, XIcon } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"
import { NormalizedMedia } from "@/types/normalized"
import Image from "next/image"
import { getImageUrl } from "@/lib/getImageUrl"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import NotificationArea from "./NotificationArea"
import { Button } from "./ui/button"

export default function SearchNavbar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NormalizedMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
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
        const res = await fetch(`/api/media/search?query=${query}`, {
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
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-8">
        {/* left: logo + desktop nav links */}
        <div className="flex items-center gap-6">
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Watch<span className="text-chart-2">logger</span>
          </span>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/home"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/watchlist"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              My List
            </Link>
            <Link
              href="/friends"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Friends
            </Link>
          </div>
        </div>

        {/* right: search + actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* desktop searchbar */}
          <div className="relative hidden md:block">
            <div className="relative w-72 lg:w-96">
              <MagnifyingGlassIcon
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search titles..."
                className="w-full py-5 pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                ref={searchInputRef}
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

          {/* mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon size={20} />
          </Button>

          <NotificationArea />

          {/* clerk auth */}
          <Show when="signed-out">
            <div className="hidden items-center gap-2 sm:flex">
              <SignInButton>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  size="sm"
                  className="cursor-pointer bg-chart-2 font-semibold text-sidebar-primary-foreground hover:bg-chart-2/80"
                >
                  Sign up
                </Button>
              </SignUpButton>
            </div>
            {/* mobile: sign in only, sign up in menu */}
            <SignInButton>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer sm:hidden"
              >
                Sign in
              </Button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>

          {/* mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
          </Button>
        </div>
      </nav>

      {/* mobile search bar */}
      {mobileSearchOpen && (
        <div className="border-t px-4 py-3 md:hidden">
          <div className="relative">
            <MagnifyingGlassIcon
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search titles..."
              className="w-full py-5 pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              ref={searchInputRef}
              autoFocus
            />
          </div>
          {loading && (
            <div className="mt-2 rounded-md border bg-popover p-5 shadow-md">
              <Spinner className="mx-auto size-7" />
            </div>
          )}
          {results.length > 0 && (
            <div className="mt-2 rounded-md border bg-popover p-2 shadow-md">
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
      )}

      {/* mobile nav menu */}
      {mobileMenuOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/home"
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/watchlist"
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              My List
            </Link>
            <Link
              href="/friends"
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Friends
            </Link>
            <Show when="signed-out">
              <div className="mt-2 border-t pt-3">
                <SignUpButton>
                  <Button className="w-full cursor-pointer bg-chart-2 font-semibold text-sidebar-primary-foreground hover:bg-chart-2/80">
                    Sign up
                  </Button>
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  )
}
