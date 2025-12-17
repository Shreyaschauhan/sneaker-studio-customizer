import { create } from "zustand"

export type SneakerPart = "upper" | "sole" | "laces"

interface CustomizerState {
  productId: string
  colors: Record<SneakerPart, string>
  material: "leather" | "canvas"
  engravedText: string
  texture: "matte" | "glossy" | "canvas"

  setProduct: (id: string) => void
  setColor: (part: SneakerPart, color: string) => void
  setMaterial: (material: "leather" | "canvas") => void
  setEngravedText: (text: string) => void
  setTexture: (texture: "matte" | "glossy" | "canvas") => void
  reset: () => void
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  productId: "air-max",
  colors: {
    upper: "#ff0000",
    sole: "#ffffff",
    laces: "#000000",
  },
  material: "leather",
  engravedText: "",
  texture: "matte",

  setProduct: (id) => set({ productId: id }),

  setColor: (part, color) =>
    set((state) => ({
      colors: { ...state.colors, [part]: color },
    })),

  setMaterial: (material) => set({ material }),

  setEngravedText: (text) => set({ engravedText: text }),

  setTexture: (texture) => set({ texture }),

  reset: () =>
    set({
      productId: "air-max",
      colors: {
        upper: "#ff0000",
        sole: "#ffffff",
        laces: "#000000",
      },
      material: "leather",
      engravedText: "",
      texture: "matte",
    }),
}))
