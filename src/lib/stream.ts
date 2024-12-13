import { env as serverEnv } from "@/data/env/server"
import { env as clientEnv } from "@/data/env/client"
import { StreamClient } from "@stream-io/node-sdk"

export const streamClient = new StreamClient(
  clientEnv.NEXT_PUBLIC_STREAM_API_KEY,
  serverEnv.STREAM_SECRET_KEY
)
