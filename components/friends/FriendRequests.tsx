import Image from "next/image"
import SectionHeader from "../SectionHeader"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react/dist/ssr"

export default async function FriendRequests() {
  const res = await fetch("https://dummyjson.com/users")
  const data = await res.json()
  // console.log(data)
  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Friend Requests (4)</SectionHeader>
      <div className="grid grid-cols-4 gap-4">
        {data.users?.slice(0, 4).map((user) => {
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex justify-center">
                  <Avatar size="lg">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">{user.firstName}</CardTitle>
                <CardDescription className="text-center">
                  @testUsername
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center gap-4">
                <Button className="cursor-pointer bg-green-600 hover:bg-green-800">
                  <CheckCircleIcon size={20} />
                  Accept
                </Button>
                <Button variant="destructive" className="cursor-pointer">
                  <XCircleIcon size={20} />
                  Reject
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
