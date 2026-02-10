"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ObjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ObjectForm({ open, onOpenChange, onSuccess }: ObjectFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      setFile(selected)
      setError(null)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selected)
    }
  }

  function removeFile() {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function resetForm() {
    setTitle("")
    setDescription("")
    setFile(null)
    setPreview(null)
    setError(null)
    setIsSubmitting(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (!description.trim()) {
      setError("Description is required")
      return
    }
    if (!file) {
      setError("Image is required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("image", file)

      const res = await fetch("/api/objects", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        console.error("[v0] API error response:", data)
        throw new Error(data.error || "Failed to create object")
      }

      resetForm()
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm()
        onOpenChange(value)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Object</DialogTitle>
          <DialogDescription>
            Add a new object with a title, description, and image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            {preview ? (
              <div className="relative overflow-hidden rounded-md border">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-36 sm:h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-36 sm:h-48 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
                disabled={isSubmitting}
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click to upload an image</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload image"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Object"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
