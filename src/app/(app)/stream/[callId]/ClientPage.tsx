"use client"

import {
  Call,
  LivestreamLayout,
  LivestreamPlayer,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export function UserStreamClientPage({ callId }: { callId: string }) {
  // const videoClient = useStreamVideoClient()
  // const [call, setCall] = useState<Call>()

  // useEffect(() => {
  //   if (videoClient == null) return
  //   let abort = false
  //   const call = videoClient?.call("livestream", callId)
  //   const joinPromise = call.join().then(() => {
  //     if (abort) return
  //     setCall(call)
  //   })

  //   return () => {
  //     abort = true
  //     joinPromise.then(() => {
  //       setCall(undefined)
  //       call.leave()
  //     })
  //   }
  // }, [videoClient, callId])

  // if (call == null) return <h1>Loading...</h1>

  return (
    <StreamTheme>
      <LivestreamPlayer callType="livestream" callId={callId} />
      {/* <StreamCall call={call}>
        <Inner />
      </StreamCall> */}
    </StreamTheme>
  )
}

function Inner() {
  const { useIsCallLive } = useCallStateHooks()
  const isLive = useIsCallLive()

  return isLive ? (
    <LivestreamLayout
      showParticipantCount={false}
      showDuration={false}
      showLiveBadge={false}
      enableFullScreen={false}
    />
  ) : (
    <div>This user is not live yet</div>
  )
}
