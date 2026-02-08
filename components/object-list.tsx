"use client"

import { useState } from "react"
import { PackageOpen } from "lucide-react"
import { ObjectCard } from "@/components/object-card"
import type { HeyamaObject } from "@/lib/types"

interface ObjectListProps {
  objects: HeyamaObject[]
  onRefresh: () => void
}

export function ObjectList({ objects, onRefresh }: ObjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this object?")) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/objects/${id}`, { method: "DELETE" })
      if (res.ok) {
        onRefresh()
      }
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setDeletingId(null)
    }
  }

  if (objects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <PackageOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No objects yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first object to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {objects.map((obj) => (
        <ObjectCard
          key={obj.id}
          object={obj}
          onDelete={handleDelete}
          isDeleting={deletingId === obj.id}
        />
      ))}
    </div>
  )
}
