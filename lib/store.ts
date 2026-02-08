import type { HeyamaObject } from "./types"

// In-memory store simulating MongoDB.
// In production, replace with MongoDB (Mongoose) calls:
//   - ObjectModel.find(), ObjectModel.findById(), ObjectModel.create(), ObjectModel.findByIdAndDelete()

const objects: Map<string, HeyamaObject> = new Map()

export function getAllObjects(): HeyamaObject[] {
  return Array.from(objects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getObjectById(id: string): HeyamaObject | undefined {
  return objects.get(id)
}

export function createObject(
  data: Omit<HeyamaObject, "id" | "createdAt" | "updatedAt">
): HeyamaObject {
  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const obj: HeyamaObject = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  objects.set(id, obj)
  return obj
}

export function deleteObject(id: string): boolean {
  return objects.delete(id)
}
