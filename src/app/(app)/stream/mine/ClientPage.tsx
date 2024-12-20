"use client"

import { updateStreamSettings } from "@/actions/stream"
import { CopyButton } from "@/components/CopyButton"
import {
  MicrophoneToggleButton,
  VideoToggleButton,
} from "@/components/DeviceButtons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { env } from "@/data/env/client"
import { useToast } from "@/hooks/use-toast"
import { streamSettingsSchema } from "@/schemas/streamSettings"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Call,
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function MyStreamClientPage({
  token,
  userId,
  userName,
  callTitle,
  callDescription,
}: {
  token: string
  userId: string
  userName: string
  callTitle: string
  callDescription: string | undefined
}) {
  const videoClient = useMemo(
    () =>
      StreamVideoClient.getOrCreateInstance({
        apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
        user: { id: userId, name: userName },
        token,
      }),
    [userId, userName, token]
  )

  const call = useMemo(
    () => videoClient.call("livestream", userId),
    [userId, videoClient]
  )

  useEffect(() => {
    call.join()

    return () => {
      call.leave()
      call.stopLive()
    }
  }, [call])

  return (
    // TODO: Maybe remove theme
    <StreamTheme>
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <LiveStreamView
            call={call}
            callTitle={callTitle}
            callDescription={callDescription}
          />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  )
}

function LiveStreamView({
  call,
  callTitle,
  callDescription,
}: {
  call: Call
  callTitle: string
  callDescription: string | undefined
}) {
  const { useParticipantCount, useIsCallLive, useParticipants } =
    useCallStateHooks()

  const participantCount = useParticipantCount()
  const isLive = useIsCallLive()

  const [firstParticipant] = useParticipants()

  const [showVideoPreview, setShowVideoPreview] = useState(true)

  return (
    <div className="flex gap-2 flex-col">
      <div>{isLive ? `Live: ${participantCount - 1}` : `Preview`}</div>
      <div className="flex gap-2">
        <VideoToggleButton />
        <MicrophoneToggleButton />
        <Button variant="outline" onClick={() => setShowVideoPreview(p => !p)}>
          {showVideoPreview ? "Hide Video Preview" : "Show Video Preview"}
        </Button>
        <StreamSettingsForm
          defaultTitle={callTitle}
          defaultDescription={callDescription}
        />
        <CopyButton
          variant="outline"
          textToCopy={`${window.origin}/stream/${call.id}`}
        >
          Copy Stream URL
        </CopyButton>
        <Button
          className="ml-auto"
          size="lg"
          variant={isLive ? "destructive" : "default"}
          onClick={() => {
            if (isLive) {
              call.stopLive()
            } else {
              call.goLive()
            }
          }}
        >
          {isLive ? "Stop Live" : "Go Live"}
        </Button>
      </div>
      {firstParticipant && showVideoPreview && (
        <ParticipantView
          mirror={false}
          ParticipantViewUI={null}
          participant={firstParticipant}
        />
      )}
    </div>
  )
}

function StreamSettingsForm({
  defaultTitle,
  defaultDescription,
}: {
  defaultTitle: string
  defaultDescription?: string
}) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof streamSettingsSchema>>({
    resolver: zodResolver(streamSettingsSchema),
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription,
    },
  })

  async function onSubmit(values: z.infer<typeof streamSettingsSchema>) {
    const { error, message } = await updateStreamSettings(values)
    toast({
      title: error ? "Error" : "Success",
      description: message,
      variant: error ? "destructive" : "default",
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Stream Settings</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
