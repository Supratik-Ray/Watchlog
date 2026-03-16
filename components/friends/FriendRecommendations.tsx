import React from "react"
import SectionHeader from "../SectionHeader"

export default function FriendRecommendations() {
  const totalRecommendations = 0
  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Recommendations from friends</SectionHeader>
      {totalRecommendations === 0 && (
        <p className="text-muted-foreground">
          No available recommendations from friends.
        </p>
      )}
    </section>
  )
}
