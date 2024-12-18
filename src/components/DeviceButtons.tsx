"use client"

import { useCallStateHooks } from "@stream-io/video-react-sdk"
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react"
import { Button } from "./ui/button"

export function MicrophoneToggleButton() {
  const { useMicrophoneState } = useCallStateHooks()

  const { microphone, isEnabled, optimisticStatus, devices, selectedDevice } =
    useMicrophoneState()

  return (
    <DeviceButton
      toggle={() => microphone.toggle()}
      isEnabled={isEnabled}
      isOptimisticEnabled={optimisticStatus === "enabled"}
      OffIcon={MicOffIcon}
      OnIcon={MicIcon}
    />
  )
}

export function VideoToggleButton() {
  const { useCameraState } = useCallStateHooks()

  const { camera, isEnabled, optimisticStatus, devices, selectedDevice } =
    useCameraState()

  return (
    <DeviceButton
      toggle={() => camera.toggle()}
      isEnabled={isEnabled}
      isOptimisticEnabled={optimisticStatus === "enabled"}
      OffIcon={VideoOffIcon}
      OnIcon={VideoIcon}
    />
  )
}

function DeviceButton({
  isEnabled,
  isOptimisticEnabled,
  toggle,
  OnIcon,
  OffIcon,
}: {
  isEnabled: boolean
  isOptimisticEnabled: boolean
  toggle: () => Promise<void>
  OnIcon: React.ComponentType
  OffIcon: React.ComponentType
}) {
  return (
    <Button
      disabled={isEnabled !== isOptimisticEnabled}
      variant={isOptimisticEnabled ? "outline" : "destructive"}
      onClick={toggle}
    >
      {isOptimisticEnabled ? <OnIcon /> : <OffIcon />}
    </Button>
  )
}
