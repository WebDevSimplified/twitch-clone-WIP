"use server"

import { streamClient } from "@/lib/stream"
import { streamSettingsSchema } from "@/schemas/streamSettings"
import { auth } from "@clerk/nextjs/server"
import { unauthorized } from "next/navigation"
import { z } from "zod"

export async function updateStreamSettings(
  values: z.infer<typeof streamSettingsSchema>
) {
  const { userId } = await auth()
  if (userId == null) unauthorized()

  const { success, data } = streamSettingsSchema.safeParse(values)

  if (!success) return { error: true, message: "Invalid data" }

  try {
    await streamClient.video.updateCall({
      custom: data,
      type: "livestream",
      id: userId,
    })
  } catch {
    return { error: true, message: "Error updating" }
  }

  return { error: false, message: "Successfully updated" }
}
