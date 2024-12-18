import { streamClient } from "@/lib/stream"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { UserStreamClientPage } from "./ClientPage"

export default async function UserStreamPage({
  params,
}: {
  params: Promise<{ callId: string }>
}) {
  // TODO: Parallelize
  const user = await currentUser()
  const { callId } = await params
  const callUser = await (await clerkClient()).users.getUser(callId)

  const { streamUser, token } = getStreamUserAndToken(user)
  const {
    calls: [data],
  } = await streamClient.video.queryCalls({
    filter_conditions: { backstage: { $eq: false }, id: { $eq: callId } },
    limit: 1,
  })

  if (data == null) return <div>This user is not live yet</div>
  const call = data.call

  return (
    <UserStreamClientPage
      callDescription={call.custom.description}
      callTitle={call.custom.title}
      callId={call.id}
      callUser={{ imageUrl: callUser.imageUrl, fullName: callUser.fullName }}
      streamUser={streamUser}
      token={token}
    />
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
