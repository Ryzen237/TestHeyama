"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HeyamaObject } from "@/lib/types"

interface ObjectCardProps {
  object: HeyamaObject
  onDelete: (id: string) => void
  isDeleting: boolean
}

export function ObjectCard({ object, onDelete, isDeleting }: ObjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/objects/${object.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={object.imageUrl}
            alt={object.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            crossOrigin="anonymous"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/objects/${object.id}`}>
              <h3 className="truncate font-semibold text-foreground transition-colors hover:text-primary">
                {object.title}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {object.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault()
              onDelete(object.id)
            }}
            disabled={isDeleting}
            aria-label={`Delete ${object.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(object.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  )
}
