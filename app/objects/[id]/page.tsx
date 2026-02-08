"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Loader2, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { HeyamaObject } from "@/lib/types"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Not found")
    return res.json()
  })

export default function ObjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: obj, error, isLoading } = useSWR<HeyamaObject>(
    `/api/objects/${id}`,
    fetcher
  )

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this object?")) return

    try {
      const res = await fetch(`/api/objects/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/")
      }
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !obj) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-semibold text-foreground">
          Object not found
        </p>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 sm:h-16 max-w-3xl items-center justify-between px-3 sm:px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-8">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden">
            <img
              src={obj.imageUrl}
              alt={obj.title}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <CardContent className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance">
              {obj.title}
            </h1>

            <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created{" "}
                {new Date(obj.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(obj.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="mt-4 sm:mt-6 whitespace-pre-wrap text-sm sm:text-base text-foreground leading-relaxed">
              {obj.description}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
