"use client"

import { useState } from "react"
import { ColorPicker } from "@/components/ColorPicker"
import { MaterialToggle } from "@/components/MaterialToggle"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCustomizerStore } from "@/store/useCustomizerStore"
import { SneakerPreview } from "@/components/SneakerPreview"
import { saveDesign } from "@/lib/designStorage"


export default function CustomizerPage() {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [ideaPrompt, setIdeaPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
  const {
    productId,
    colors,
    material,
    engravedText,
    setColor,
    setMaterial,
    setEngravedText,
    
  } = useCustomizerStore()

  const handleSave = () => {
    const ok = saveDesign({
      productId,
      colors,
      material,
      engravedText,
    })
    setStatus(ok ? "saved" : "error")
    setTimeout(() => setStatus("idle"), 2200)
  }

  const handleAiSuggest = async () => {
    setAiError("")
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: ideaPrompt }),
      })
      if (!res.ok) throw new Error("Failed to get ideas")
      const data: {
        upperColor: string
        soleColor: string
        lacesColor: string
        material: "leather" | "canvas"
      } = await res.json()
      setColor("upper", data.upperColor)
      setColor("sole", data.soleColor)
      setColor("laces", data.lacesColor)
      setMaterial(data.material)
    } catch (error) {
      setAiError("Couldn’t fetch ideas. Try again.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:py-12">
        {/* Sidebar */}
        <aside className="w-full max-w-[360px] space-y-6 rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white/95 via-white/85 to-white/75 p-7 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800/70 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/50">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Sneaker Studio
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Design your perfect pair
            </h2>
            <p className="text-sm text-muted-foreground">
              Dial in finishes, materials, and signature touches.
            </p>
          </div>

          

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm ring-1 ring-white/40 transition-all hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-inner dark:border-slate-800/60 dark:bg-slate-900/60">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
                Local drafts
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em]">Autosave-ready</span>
            </div>

            <div className="space-y-4">
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
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 ring-1 ring-white/50 transition-all hover:border-slate-200 dark:border-slate-800/60 dark:bg-slate-900/50 dark:ring-0">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Material
                </Label>
                <MaterialToggle value={material} onChange={setMaterial} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Engraved Text
                </Label>
                <Input
                  placeholder="My Custom Kick"
                  value={engravedText}
                  onChange={(e) => setEngravedText(e.target.value)}
                  className="h-11 rounded-xl border-slate-200/80 bg-white/90 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm ring-1 ring-white/40 dark:border-slate-800/60 dark:bg-slate-900/50">
              <div className="flex-1">
                <p className="text-sm font-semibold">Save design</p>
                <p className="text-xs text-muted-foreground">
                  Stores locally and appears in your gallery.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button size="sm" onClick={handleSave} className="px-4">
                  Save
                </Button>
                {status === "saved" && (
                  <span className="text-[11px] font-medium text-emerald-500">
                    Saved to gallery
                  </span>
                )}
                {status === "error" && (
                  <span className="text-[11px] font-medium text-amber-500">
                    Could not save
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm ring-1 ring-white/40 dark:border-slate-800/60 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Design Ideas
                </Label>
                {aiError && (
                  
                  <span className="text-[11px] font-medium text-amber-500">
                    {aiError}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Bold streetwear vibes..."
                  value={ideaPrompt}
                  onChange={(e) => setIdeaPrompt(e.target.value)}
                  className="h-11 rounded-xl border-slate-200/80 bg-white/90 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700"
                />
                <Button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading || !ideaPrompt.trim()}
                  className="h-11 whitespace-nowrap px-4"
                >
                  {aiLoading ? "Thinking..." : "Get Ideas"}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview */}
        <section className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-10 shadow-2xl shadow-slate-200/60 ring-1 ring-black/5 dark:border-slate-800/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900">
            <div className="absolute inset-x-10 top-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-slate-100 px-3 py-1 tracking-wide shadow-sm ring-1 ring-slate-200 transition-colors dark:bg-slate-800 dark:ring-slate-700">
                Live Preview
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em]">
                Premium finish
              </span>
            </div>
            <div className="relative mt-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 shadow-inner ring-1 ring-slate-200/70 transition-all hover:ring-slate-300/80 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 dark:ring-slate-800/60">
              <SneakerPreview />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
