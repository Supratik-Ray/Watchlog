import React from "react"

export default function SectionHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <h2 className="mb-6 border-l-5 border-primary pl-3 text-lg font-bold">
      {children}
    </h2>
  )
}
