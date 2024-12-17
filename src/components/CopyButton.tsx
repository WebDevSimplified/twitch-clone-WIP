"use client"

import { Button } from "@/components/ui/button"
import { CopyCheckIcon, CopyIcon, CopyXIcon } from "lucide-react"
import { ComponentPropsWithRef, ReactNode, useState } from "react"

type CopyState = "idle" | "copied" | "error"

export function CopyButton({
  textToCopy,
  onClick,
  children,
  ...props
}: { textToCopy: string } & ComponentPropsWithRef<typeof Button>) {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const Icon = getCopyIcon(copyState)

  return (
    <Button
      {...props}
      onClick={e => {
        onClick?.(e)
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setCopyState("copied")
            setTimeout(() => setCopyState("idle"), 2000)
          })
          .catch(() => {
            setCopyState("error")
            setTimeout(() => setCopyState("idle"), 2000)
          })
      }}
    >
      {<Icon className="size-4 mr-2" />}
      {getChildren(copyState, children)}
    </Button>
  )
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return CopyIcon
    case "copied":
      return CopyCheckIcon
    case "error":
      return CopyXIcon
  }
}

function getChildren(copyState: CopyState, defaultText: ReactNode) {
  switch (copyState) {
    case "idle":
      return defaultText
    case "copied":
      return "Copied!"
    case "error":
      return "Error"
  }
}
