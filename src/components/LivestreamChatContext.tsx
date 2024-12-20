"use client"

import { env } from "@/data/env/client"
import { useEffect, useState } from "react"
import { StreamChat } from "stream-chat"
import { Chat } from "stream-chat-react"

export function LiveStreamChatContext({
  token,
  streamUser,
  loadingFallback,
  children,
}: {
  token: string | undefined
  streamUser: { id: string; name: string } | { type: "anonymous"; id?: never }
  loadingFallback: React.ReactNode
  children: React.ReactNode
}) {
  const [chatClient, setChatClient] = useState<StreamChat>()
  useEffect(() => {
    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_API_KEY)

    let connectPromise: Promise<unknown>
    let abort = false
    if (token != null && streamUser.id != null) {
      connectPromise = client.connectUser(streamUser, token)
    } else {
      connectPromise = client.connectAnonymousUser()
    }

    connectPromise.then(() => {
      if (abort) return
      setChatClient(client)
    })

    return () => {
      abort = true
      connectPromise.then(() => {
        setChatClient(undefined)
        client.disconnectUser()
      })
    }
  }, [streamUser, token])

  if (chatClient == null) return loadingFallback

  return <Chat client={chatClient}>{children}</Chat>
}
