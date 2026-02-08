import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { getObjectById, deleteObject } from "@/lib/store"

// GET /api/objects/:id - Get object detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const obj = getObjectById(id)

    if (!obj) {
      return NextResponse.json(
        { error: "Object not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(obj)
  } catch (error) {
    console.error("Error fetching object:", error)
    return NextResponse.json(
      { error: "Failed to fetch object" },
      { status: 500 }
    )
  }
}

// DELETE /api/objects/:id - Delete object and its image
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const obj = getObjectById(id)

    if (!obj) {
      return NextResponse.json(
        { error: "Object not found" },
        { status: 404 }
      )
    }

    // Delete image from Vercel Blob (S3-compatible)
    try {
      await del(obj.imageUrl)
    } catch (blobError) {
      console.error("Error deleting blob:", blobError)
      // Continue with object deletion even if blob fails
    }

    // Delete from store (simulating MongoDB)
    deleteObject(id)

    return NextResponse.json({ message: "Object deleted successfully" })
  } catch (error) {
    console.error("Error deleting object:", error)
    return NextResponse.json(
      { error: "Failed to delete object" },
      { status: 500 }
    )
  }
}
