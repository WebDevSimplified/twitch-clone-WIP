"use client"

import { env } from "@/data/env/client"
import {
  LivestreamPlayer,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk"
import { useMemo } from "react"

export function UserStreamClientPage({
  token,
  streamUser,
  callId,
  callTitle,
  callDescription,
}: {
  token: string | undefined
  streamUser: { type: "anonymous" } | { id: string; name: string }
  callId: string
  callTitle: string
  callDescription: string | undefined
}) {
  const videoClient = useMemo(
    () =>
      StreamVideoClient.getOrCreateInstance({
        apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
        user: streamUser,
        token,
      }),
    [streamUser, token]
  )

  return (
    // TODO: Maybe remove theme
    <StreamTheme>
      <StreamVideo client={videoClient}>
        <LivestreamPlayer callType="livestream" callId={callId} />
      </StreamVideo>
    </StreamTheme>
  )
}
