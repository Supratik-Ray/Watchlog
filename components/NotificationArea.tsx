"use client"

import { useUser } from "@clerk/nextjs"
import { BellIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { pusher } from "@/lib/pusher/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import toast from "react-hot-toast"

type Notification = {
  id: string
  type: "friend_request" | "recommendation"
  senderId: string
}

export default function NotificationArea() {
  const { user, isLoaded } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isLoaded || !user) return

    const channel = pusher.subscribe(`private-user-${user.id}`)

    channel.bind("notification", async (data: Notification) => {
      const res = await fetch(`/api/users/${data.senderId}`)
      const user = await res.json()
      setNotifications((prev) => [{ ...data, user }, ...prev])
      setUnreadCount((c) => c + 1)
      toast.success(`new ${data.type.replaceAll("_", " ")}`)
    })

    return () => pusher.unsubscribe(`private-user-${user.id}`)
  }, [user, isLoaded])

  function handleOpen() {
    // clear badge count when opened
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <Popover onOpenChange={(open) => open && handleOpen()}>
      <PopoverTrigger asChild>
        <button className="relative">
          <BellIcon size={23} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No recent notifications
            </p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 border-b px-4 py-3 last:border-0 hover:bg-muted"
              >
                <span className="text-sm font-medium">
                  {notification.type === "friend_request"
                    ? `New friend request from ${notification.user.name}`
                    : `New recommendation from ${notification.user.name}`}
                </span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
