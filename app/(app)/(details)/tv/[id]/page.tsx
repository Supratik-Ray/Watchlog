import { getDetails } from "@/lib/api"

export default async function ShowDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getDetails("tv", id)
  const data = await res.json()
  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  )
}
