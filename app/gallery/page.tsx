"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { deleteDesign, getDesigns, type SneakerDesign } from "@/lib/designStorage"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function GalleryPage() {
  const [designs, setDesigns] = useState<SneakerDesign[]>([])

  useEffect(() => {
    try {
      setDesigns(getDesigns())
    } catch (error) {
      console.error("Failed to load designs from localStorage", error)
    }
  }, [])

  const handleDelete = (id: string) => {
    deleteDesign(id)
    setDesigns((prev) => prev.filter((design) => design.id !== id))
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 bg-gradient-to-b from-background via-background to-background px-4 py-12 sm:px-6 lg:px-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Gallery
          </div>
          <span className="text-muted-foreground text-sm">Local only</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Saved sneakers
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Curated view of everything you have saved in this browser. Clean up what you don&apos;t need.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 text-xs text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]" />
            <span>Stored locally</span>
          </div>
        </div>
      </header>

      {designs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <Card
              key={design.id}
              className="group relative overflow-hidden border-border/70 bg-card/80 shadow-[0_10px_35px_-25px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-border hover:shadow-[0_16px_45px_-25px_rgba(0,0,0,0.55)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/5 via-primary/0 to-transparent opacity-80" />
              <CardHeader className="pb-4">
                <CardTitle className="flex items-start justify-between gap-3 text-base">
                  <div className="flex flex-col gap-1">
                    <span className="truncate text-sm font-semibold sm:text-base">
                      {design.engravedText || "Untitled design"}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      <Badge>{design.material}</Badge>
                      <span className="text-muted-foreground/60">•</span>
                      <span>{design.productId}</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">
                    {new Date(design.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground/90">
                  Quick glance at your colorway and details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ColorRow colors={design.colors} />
                <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    Saved locally. No account required.
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(design.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center shadow-inner">
      <div className="flex items-center gap-3 rounded-full bg-background px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
        <span className="text-lg">🧺</span>
        <span>No saved designs yet</span>
      </div>
      <p className="max-w-md text-balance text-sm text-muted-foreground/80">
        Customize a sneaker and hit save to see your designs here. Everything stays in your browser.
      </p>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border bg-accent/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  )
}

function ColorRow({
  colors,
}: {
  colors: { upper: string; sole: string; laces: string }
}) {
  const swatches = [
    { label: "Upper", value: colors.upper },
    { label: "Sole", value: colors.sole },
    { label: "Laces", value: colors.laces },
  ]

  return (
    <div className="flex gap-3">
      {swatches.map((swatch) => (
        <div
          key={swatch.label}
          className="flex flex-1 items-center gap-3 rounded-lg border bg-card/80 p-3 shadow-xs transition-colors hover:border-primary/50"
        >
          <span
            className={cn(
              "h-8 w-8 rounded-md border",
              swatch.value ? "border-border" : "border-muted"
            )}
            style={{ backgroundColor: swatch.value || "#f3f4f6" }}
          />
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">{swatch.label}</span>
            <span className="text-muted-foreground text-[11px]">
              {swatch.value || "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
