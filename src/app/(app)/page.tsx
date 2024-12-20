import { streamClient } from "@/lib/stream"
import Image from "next/image"
import Link from "next/link"
import { connection } from "next/server"

export default async function HomePage() {
  // TODO: May need to move location of connection
  await connection()
  const { calls } = await streamClient.video.queryCalls({
    filter_conditions: { type: "livestream", backstage: { $eq: false } },
  })
  if (calls.length === 0) {
    return (
      <div className="flex items-center flex-col gap-4 mt-8">
        <h1 className="text-3xl font-bold">No Streams</h1>
        <p className="text-lg">
          It looks like no one is streaming right now. Come back later or try
          streaming yourself.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {calls.map(({ call }) => (
        <div key={call.id}>
          <Link
            href={`/stream/${call.id}`}
            className="relative aspect-video block"
          >
            {call.thumbnails?.image_url == null ? (
              <div className="absolute inset-0 bg-primary" />
            ) : (
              <Image
                fill
                src={call.thumbnails.image_url}
                alt={`${call.custom.title} preview`}
              />
            )}
            <div className="absolute left-2 bottom-2 bg-primary/75 text-primary-foreground px-1 py-0.5 text-sm pointer-events-none">
              {(call.session?.anonymous_participant_count ?? 0) +
                (call.session?.participants.length ?? 0)}{" "}
              viewers
            </div>
          </Link>
          <div className="flex gap-4 items-center mb-4">
            {call.created_by.image && (
              <Image
                className="rounded-full border"
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
        </div>
      ))}
    </div>
  )
}
