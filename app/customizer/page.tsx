"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"

export default function CustomizerPage() {
  const { colors, material, engravedText } = useCustomizerStore()

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Customize</h2>
        <p className="text-sm text-muted-foreground">
          Pick colors, materials and add text
        </p>
      </aside>

      {/* Preview */}
      <section className="flex-1 flex items-center justify-center bg-muted">
        <div className="text-center">
          <p>Upper Color: {colors.upper}</p>
          <p>Sole Color: {colors.sole}</p>
          <p>Laces Color: {colors.laces}</p>
          <p>Material: {material}</p>
          <p>Text: {engravedText || "—"}</p>
        </div>
      </section>
    </main>
  )
}
