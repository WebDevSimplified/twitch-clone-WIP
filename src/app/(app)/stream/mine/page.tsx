import { streamClient } from "@/lib/stream"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { unauthorized } from "next/navigation"
import { MyStreamClientPage } from "./ClientPage"
import { ClientOnly } from "@/components/ClientOnly"

export default async function YourStreamPage() {
  const user = await currentUser()
  if (user == null) return unauthorized()

  const token = streamClient.generateUserToken({ user_id: user.id })
  const { call } = await streamClient.video
    .call("livestream", user.id)
    .getOrCreate({
      data: {
        created_by_id: user.id,
        custom: {
          title: `${user.fullName}'s Stream`,
        },
      },
    })

  return (
    <ClientOnly>
      <MyStreamClientPage
        token={token}
        userId={user.id}
        userName={user.fullName || "Anonymous"}
        callTitle={call.custom.title}
        callDescription={call.custom.description}
      />
    </ClientOnly>
  )
}
