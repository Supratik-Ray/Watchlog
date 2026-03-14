import { getDetails } from "@/lib/api"

export default async function ShowDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getDetails("tv", id)

  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  )
}
