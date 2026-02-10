export interface HeyamaObject {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface CreateObjectInput {
  title: string
  description: string
  imageUrl: string
}
