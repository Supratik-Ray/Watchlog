import Pusher from "pusher"

export const pusher = new Pusher({
  appId: "2127959",
  key: "303cc69395b0eb64dec1",
  secret: "1e57642659d5dd75e718",
  cluster: "ap2",
  useTLS: true,
})
