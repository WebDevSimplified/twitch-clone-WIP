import { z } from "zod"

export const streamSettingsSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})
