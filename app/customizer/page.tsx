"use client"

import { ColorPicker } from "@/components/ColorPicker"
import { MaterialToggle } from "@/components/MaterialToggle"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCustomizerStore } from "@/store/useCustomizerStore"
import { SneakerPreview } from "@/components/SneakerPreview"



export default function CustomizerPage() {

  const {
    colors,
    material,
    engravedText,
    setColor,
    setMaterial,
    setEngravedText,
  } = useCustomizerStore()

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r p-4 space-y-6">
  <h2 className="text-xl font-semibold">Customize Sneaker</h2>

  <ColorPicker
    label="Upper Color"
    value={colors.upper}
    onChange={(v) => setColor("upper", v)}
  />

  <ColorPicker
    label="Sole Color"
    value={colors.sole}
    onChange={(v) => setColor("sole", v)}
  />

  <ColorPicker
    label="Laces Color"
    value={colors.laces}
    onChange={(v) => setColor("laces", v)}
  />

  <div className="space-y-2">
    <Label>Material</Label>
    <MaterialToggle value={material} onChange={setMaterial} />
  </div>

  <div className="space-y-2">
    <Label>Engraved Text</Label>
    <Input
      placeholder="My Custom Kick"
      value={engravedText}
      onChange={(e) => setEngravedText(e.target.value)}
    />
  </div>
</aside>


      {/* Preview */}
      <section className="flex-1 flex items-center justify-center bg-muted">
           <SneakerPreview />
      </section>

    </main>
  )
}
