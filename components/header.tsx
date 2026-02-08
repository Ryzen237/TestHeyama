"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onCreateClick: () => void
}

export function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Heyama
          </span>
        </Link>
        <Button onClick={onCreateClick} size="sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Object</span>
        </Button>
      </div>
    </header>
  )
}
