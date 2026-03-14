import React from "react"

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>
}) {
  const { query } = await searchParams
  return <div>Search for {query}</div>
}
