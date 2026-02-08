import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createObject, getAllObjects } from "@/lib/store"

// GET /api/objects - List all objects
export async function GET() {
  try {
    const objects = getAllObjects()
    return NextResponse.json(objects)
  } catch (error) {
    console.error("Error fetching objects:", error)
    return NextResponse.json(
      { error: "Failed to fetch objects" },
      { status: 500 }
    )
  }
}

// POST /api/objects - Create a new object with image upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const file = formData.get("image") as File | null

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Upload image to Vercel Blob (S3-compatible storage)
    const blob = await put(`heyama/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Create object in store (simulating MongoDB)
    const obj = createObject({
      title,
      description,
      imageUrl: blob.url,
    })

    return NextResponse.json(obj, { status: 201 })
  } catch (error) {
    console.error("Error creating object:", error)
    return NextResponse.json(
      { error: "Failed to create object" },
      { status: 500 }
    )
  }
}
