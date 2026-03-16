import Pusher from "pusher-js"

export const pusher = new Pusher("303cc69395b0eb64dec1", {
  cluster: "ap2",
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
})
