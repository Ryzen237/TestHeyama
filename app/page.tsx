"use client"

import { useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { ObjectList } from "@/components/object-list"
import { ObjectForm } from "@/components/object-form"
import type { HeyamaObject } from "@/lib/types"
import { Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [formOpen, setFormOpen] = useState(false)

  // SWR with 3-second polling simulates real-time Socket.IO updates.
  // When an object is created on mobile or another client,
  // it appears here within 3 seconds.
  const { data, error, isLoading, mutate } = useSWR<HeyamaObject[]>(
    "/api/objects",
    fetcher,
    { refreshInterval: 3000 }
  )

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateClick={() => setFormOpen(true)} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Objects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your objects. Changes sync in real-time across all clients.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-destructive">
              Failed to load objects. Please try again.
            </p>
          </div>
        ) : (
          <ObjectList objects={data || []} onRefresh={() => mutate()} />
        )}
      </main>

      <ObjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => mutate()}
      />
    </div>
  )
}
