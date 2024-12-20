"use client"

import { env } from "@/data/env/client"
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export function LiveStreamVideoContext({
  token,
  streamUser,
  loadingFallback,
  children,
}: {
  token: string | undefined
  streamUser: { id: string; name: string } | { type: "anonymous" }
  loadingFallback: React.ReactNode
  children: React.ReactNode
}) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()

  useEffect(() => {
    const client = StreamVideoClient.getOrCreateInstance({
      apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
      user: streamUser,
      token,
      options: { logLevel: "debug" },
    })
    setVideoClient(client)

    return () => {
      client.disconnectUser()
      setVideoClient(undefined)
    }
  }, [streamUser, token])

  if (videoClient == null) return loadingFallback

  return <StreamVideo client={videoClient}>{children}</StreamVideo>
}
