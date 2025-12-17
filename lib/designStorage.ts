import { v4 as uuidv4 } from "uuid"

const STORAGE_KEY = "sneaker_designs"

function safeGet(): SneakerDesign[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export type SneakerDesign = {
  id: string
  productId: string
  colors: {
    upper: string
    sole: string
    laces: string
  }
  material: "leather" | "canvas"
  engravedText: string
  createdAt: string
}

export function getDesigns(): SneakerDesign[] {
  return safeGet()
}

export function saveDesign(design: Omit<SneakerDesign, "id" | "createdAt">) {
  try {
    const designs = safeGet()
    designs.unshift({
      ...design,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    })
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    }
    return true
  } catch (error) {
    console.error("Failed to save design", error)
    return false
  }
}

export function deleteDesign(id: string) {
  try {
    const designs = safeGet().filter((d) => d.id !== id)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    }
    return true
  } catch (error) {
    console.error("Failed to delete design", error)
    return false
  }
}
