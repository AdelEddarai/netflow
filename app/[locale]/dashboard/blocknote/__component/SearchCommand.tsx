"use client"

import * as React from "react"
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import Link from 'next/link'
import { LucideStickyNote } from "lucide-react"

export const CommandDialogDemo = () => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
          <Link href="/dashboard/blocknote">
              <CommandItem>
                <LucideStickyNote className="mr-2 h-4 w-4" />
                <span>Blocknote</span>
              </CommandItem>
            </Link>
            <Link href="/dashboard/calendar">
              <CommandItem>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
            </Link>
            <Link href="/dashboard">
              <CommandItem>
                <RocketIcon className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <Link href="dashboard/settings">
              <CommandItem>
                <GearIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="dashboard/room">
              <CommandItem>
                <GearIcon className="mr-2 h-4 w-4" />
                <span>VideoChat</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

    </>
  )
}
