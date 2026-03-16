import FriendList from "@/components/friends/FriendList"
import FriendRecommendations from "@/components/friends/FriendRecommendations"
import FriendRequests from "@/components/friends/FriendRequests"
import UserSearch from "@/components/friends/UserSearch"

export default function FriendsPage() {
  return (
    <div className="py-12">
      <UserSearch />
      <FriendRequests />
      <FriendList />
      <FriendRecommendations />
    </div>
  )
}
