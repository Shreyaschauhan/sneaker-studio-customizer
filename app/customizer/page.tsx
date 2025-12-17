"use client"

import { useState } from "react"
import { ColorPicker } from "@/components/ColorPicker"
import { MaterialToggle } from "@/components/MaterialToggle"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
    texture,
    setColor,
    setMaterial,
    setEngravedText,
    setProduct,
    setTexture,
    
  } = useCustomizerStore()

  const isUpperDark = () => {
    const hex = colors.upper.replace("#", "")
    if (hex.length !== 6) return false
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.28
  }

  const handleSave = () => {
    const ok = saveDesign({
      productId,
      colors,
      material,
      engravedText,
      texture,
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
    <main className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.12),transparent_30%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-12">
        {/* Sidebar */}
        <aside className="w-full max-w-[380px] space-y-6 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white/90 via-white/85 to-white/75 p-7 shadow-2xl shadow-slate-200/50 ring-1 ring-white/50 backdrop-blur-xl dark:border-slate-800/80 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/60 dark:ring-black/30">
          <div className="space-y-3 border-b border-dashed border-slate-200/80 pb-6 dark:border-slate-800/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 shadow-sm transition hover:-translate-y-[1px] hover:shadow dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              Sneaker Studio
            </span>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              Design your perfect pair
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dial in finishes, materials, and signature touches with a calm, focused workspace.
            </p>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg ring-1 ring-white/50 transition-all hover:-translate-y-[1px] hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:ring-black/30">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
                Local drafts
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em]">Autosave-ready</span>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 ring-1 ring-white/60 transition-all hover:-translate-y-[1px] hover:border-slate-200 hover:ring-slate-100 dark:border-slate-800/70 dark:bg-slate-900/60 dark:ring-black/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Base Product
                  </Label>
                  <Select value={productId} onValueChange={setProduct}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200/80 bg-white text-sm shadow-sm transition duration-150 focus-visible:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-emerald-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700">
                      <SelectValue placeholder="Choose a base" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/80 bg-white shadow-lg dark:border-slate-800/70 dark:bg-slate-900">
                      <SelectItem value="air-max">Air Max</SelectItem>
                      <SelectItem value="jordan">Jordan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-200/80 dark:bg-slate-800/60" />

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
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-white/60 transition-all hover:-translate-y-[1px] hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/60 dark:ring-black/20">
              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Material
                </Label>
                <MaterialToggle value={material} onChange={setMaterial} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Texture
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "matte", label: "Matte" },
                    { value: "glossy", label: "Glossy" },
                    { value: "canvas", label: "Canvas" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTexture(option.value as typeof texture)}
                      className="group rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-white/60 transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/60 dark:ring-black/20"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`h-6 rounded-full px-3 text-[11px] uppercase tracking-[0.18em] ${texture === option.value ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800" : "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"}`}
                        >
                          {option.label}
                        </Badge>
                        <span className="text-sm text-slate-700 transition group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white">
                          {option.value === texture ? "Selected" : "Tap to set"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Engraved Text
                </Label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip open={isUpperDark() && Boolean(engravedText.trim())}>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="My Custom Kick"
                        value={engravedText}
                        onChange={(e) => setEngravedText(e.target.value)}
                        className="h-11 rounded-xl border-slate-200/80 bg-white text-sm shadow-sm transition duration-150 focus-visible:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-emerald-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[220px] rounded-xl border-amber-100 bg-amber-50 text-amber-700 shadow-md ring-1 ring-amber-100 dark:border-amber-800/60 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-900/60">
                      Text visibility may be reduced on dark colors
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm ring-1 ring-white/60 transition hover:-translate-y-[1px] hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/60 dark:ring-black/20">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold">Save design</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stores locally and appears in your gallery.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="px-4 shadow-sm transition duration-150 hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
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

            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-white/60 transition hover:-translate-y-[1px] hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/60 dark:ring-black/20">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                  className="h-11 rounded-xl border-slate-200/80 bg-white text-sm shadow-sm transition duration-150 focus-visible:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-emerald-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700"
                />
                <Button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading || !ideaPrompt.trim()}
                  className="h-11 whitespace-nowrap px-4 shadow-sm transition duration-150 hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:translate-y-0 disabled:opacity-60"
                >
                  {aiLoading ? "Thinking..." : "Get Ideas"}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview */}
        <section className="flex flex-1 items-center justify-center">
          <div className="group relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-12 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] ring-1 ring-black/5 backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-900/85 dark:to-slate-900/70">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-24 top-10 h-32 w-32 rounded-full bg-emerald-400/12 blur-3xl transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              <div className="absolute -right-20 bottom-8 h-44 w-44 rounded-full bg-sky-400/12 blur-3xl transition duration-500 group-hover:translate-y-1 group-hover:-translate-x-1" />
            </div>
            <div className="absolute inset-6 rounded-[28px] border border-white/60 bg-white/40 shadow-inner backdrop-blur-xl ring-1 ring-slate-200/60 transition duration-300 group-hover:ring-slate-300/80 dark:border-white/5 dark:bg-white/5 dark:ring-slate-800/60" />
            <div className="absolute inset-x-12 top-6 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 tracking-[0.22em] shadow-sm ring-1 ring-white/50 transition duration-150 group-hover:-translate-y-[1px] group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:ring-black/20">
                Live Preview
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-500 shadow-inner ring-1 ring-slate-200 transition duration-150 group-hover:-translate-y-[1px] dark:bg-slate-800 dark:ring-slate-700">
                Premium finish
              </span>
            </div>
            <div className="relative mt-14 flex items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 shadow-inner ring-1 ring-slate-200/70 transition-all duration-200 hover:ring-slate-300/90 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 dark:ring-slate-800/60">
              <div className="absolute inset-6 rounded-3xl border border-dashed border-slate-200/70 opacity-70 transition duration-200 group-hover:border-slate-300/80 dark:border-slate-800/80" />
              <SneakerPreview />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
