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
import { ArrowSquareOutIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr"

export default async function FriendList() {
  const res = await fetch("https://dummyjson.com/users")
  const data = await res.json()
  return (
    <section className="container mx-auto mb-12">
      <SectionHeader>Your Friends (5)</SectionHeader>
      <div className="flex flex-col gap-4">
        {data.users?.slice(0, 4).map((user) => {
          return (
            <Card key={user.id}>
              <div className="flex items-center justify-between px-10">
                <div className="flex items-center">
                  <Avatar size="lg">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <CardHeader>
                    <CardTitle className="text-center">
                      {user.firstName}
                    </CardTitle>
                    <CardDescription className="text-center">
                      @testUsername
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardFooter className="flex gap-4">
                  <Button size="sm" className="cursor-pointer">
                    <ArrowSquareOutIcon size={20} />
                    Profile
                  </Button>
                  <Button variant="destructive" className="cursor-pointer">
                    <TrashIcon size={20} />
                    Remove
                  </Button>
                </CardFooter>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
