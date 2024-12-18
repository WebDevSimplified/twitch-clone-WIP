"use client"

import { env } from "@/data/env/client"
import {
  LivestreamPlayer,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk"
import Image from "next/image"
import { useMemo } from "react"

export function UserStreamClientPage({
  token,
  streamUser,
  callId,
  callTitle,
  callUser,
  callDescription,
}: {
  token: string | undefined
  streamUser: { type: "anonymous" } | { id: string; name: string }
  callId: string
  callTitle: string
  callUser: {
    imageUrl: string | null
    fullName: string | null
  }
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
    <>
      <div className="flex gap-4 items-center mb-4">
        {callUser.imageUrl && (
          <Image
            className="rounded-full border"
            width={60}
            height={60}
            src={callUser.imageUrl}
            alt={callUser.fullName || "Profile"}
          />
        )}
        <div className="flex flex-col gap-2 justify-between">
          {callUser.fullName && (
            <div className="text-lg font-bold">{callUser.fullName}</div>
          )}
          <h1>{callTitle}</h1>
        </div>
      </div>
      {/* TODO: Maybe remove theme */}
      <StreamTheme>
        <StreamVideo client={videoClient}>
          <LivestreamPlayer callType="livestream" callId={callId} />
        </StreamVideo>
      </StreamTheme>
    </>
  )
}
