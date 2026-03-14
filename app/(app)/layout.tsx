import SearchNavbar from "@/components/SearchNavbar"

export default function SearchBarlayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SearchNavbar />
      <main className="flex-1">{children}</main>
    </>
  )
}
