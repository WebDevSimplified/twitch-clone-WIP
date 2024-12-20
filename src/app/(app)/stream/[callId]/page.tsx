import { streamClient } from "@/lib/stream"
import { currentUser } from "@clerk/nextjs/server"
import { UserStreamClientPage } from "./ClientPage"
import { LiveStreamVideoContext } from "@/components/LivestreamVideoContext"
import Image from "next/image"
import { notFound } from "next/navigation"
import { LiveStreamChatContext } from "@/components/LivestreamChatContext"
import { LivestreamChat } from "@/components/LivestreamChat"

export default async function UserStreamPage({
  params,
}: {
  params: Promise<{ callId: string }>
}) {
  // TODO: Parallelize
  const user = await currentUser()
  const { callId } = await params

  const { streamUser, token } = getStreamUserAndToken(user)
  const {
    calls: [data],
  } = await streamClient.video.queryCalls({
    filter_conditions: {
      type: "livestream",
      id: { $eq: callId },
    },
    limit: 1,
  })

  if (data == null) return notFound()

  const call = data.call

  return (
    <>
      <div className="grid lg:grid-cols-[1fr,20rem] grid-cols-1 gap-4 h-full">
        <div className="max-h-full">
          <div className="flex gap-4 items-center mb-4">
            {call.created_by.image && (
              <Image
                className="rounded-full"
                width={60}
                height={60}
                src={call.created_by.image}
                alt={call.created_by.name || "Profile"}
              />
            )}
            <div className="flex flex-col gap-2 justify-between">
              {call.created_by.name && (
                <div className="text-lg font-bold">{call.created_by.name}</div>
              )}
              {call != null && <h1>{call.custom.title}</h1>}
            </div>
          </div>
          <LiveStreamVideoContext
            token={token}
            streamUser={streamUser}
            loadingFallback={<div>Loading...</div>}
          >
            <UserStreamClientPage callId={call.id} />
          </LiveStreamVideoContext>
        </div>
        <LiveStreamChatContext
          token={token}
          streamUser={streamUser}
          loadingFallback={<div>Loading...</div>}
        >
          <LivestreamChat callId={call.id} />
        </LiveStreamChatContext>
      </div>
    </>
  )
}

function getStreamUserAndToken(
  user: { id: string; fullName: string | null } | null
): {
  streamUser: { id: string; name: string } | { type: "anonymous" }
  token?: string
} {
  if (user) {
    return {
      streamUser: { id: user.id, name: user.fullName || "Anonymous" },
      token: streamClient.generateUserToken({ user_id: user.id }),
    }
  }
  return {
    streamUser: { type: "anonymous" },
  }
}
