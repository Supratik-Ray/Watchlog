import FriendList from "@/components/friends/FriendList"
import FriendRecommendations from "@/components/friends/FriendRecommendations"
import FriendRequests from "@/components/friends/FriendRequests"
import UserSearch from "@/components/friends/UserSearch"

export default function FriendsPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <UserSearch />
      <FriendRequests />
      <FriendList />
      <FriendRecommendations />
    </div>
  )
}
