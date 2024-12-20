"use client"

import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
  useMessageContext,
  useMessageInputContext,
  Window,
} from "stream-chat-react"
import "stream-chat-react/dist/css/v2/index.css"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function LivestreamChat({ callId }: { callId: string }) {
  const { client: chatClient } = useChatContext()
  const channel = chatClient.channel("livestream", callId)

  return (
    <Channel channel={channel}>
      <Window>
        <MessageList disableDateSeparator Message={CustomMessage} />
        {chatClient.user?.role === "anonymous" ? (
          <Button>Sign In To Chat</Button>
        ) : (
          <MessageInput Input={CustomInput} />
        )}
      </Window>
    </Channel>
  )
}

function CustomMessage() {
  const { message } = useMessageContext()
  if (!message.text || message.deleted_at) return null

  return (
    <div className="text-sm break-words w-full">
      <span className="text-muted-foreground text-bold mr-1">
        {message.user?.name || "anonymous"}:
      </span>
      <span>{message.text}</span>
    </div>
  )
}

function CustomInput() {
  const context = useMessageInputContext()
  return (
    <form onSubmit={context.handleSubmit}>
      <Input
        onChange={e => context.setText(e.target.value)}
        value={context.text}
      />
      {/* <Button type="submit">Send</Button> */}
    </form>
  )
}
