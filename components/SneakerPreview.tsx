"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useCallback, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useCustomizerStore } from "@/store/useCustomizerStore"


export function SneakerPreview() {
  const { colors, engravedText } = useCustomizerStore()
  const [zoom, setZoom] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return
    const dataUrl = await toPng(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "transparent",
    })
    const link = document.createElement("a")
    link.download = "sneaker-preview.png"
    link.href = dataUrl
    link.click()
  }, [])

  return (
    <div className="space-y-4">
      <motion.div
        ref={previewRef}
        className="relative isolate mx-auto grid h-[430px] w-full max-w-[900px] place-items-center overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-50/95 via-white/92 to-slate-100/85 p-9 shadow-[0_28px_70px_-35px_rgba(15,23,42,0.55)] ring-1 ring-slate-200/80 backdrop-blur-sm dark:from-slate-900/90 dark:via-slate-900/82 dark:to-slate-950/82 dark:ring-slate-800/70"
        initial={{ opacity: 0, scale: 0.98, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-10 rounded-[30px] bg-gradient-to-br from-white/50 via-slate-50/40 to-slate-100/35 shadow-inner ring-1 ring-slate-200/60 dark:from-slate-900/60 dark:via-slate-900/50 dark:to-slate-950/40 dark:ring-slate-800/70" />
          <div className="absolute inset-x-14 bottom-9 h-24 rounded-full bg-slate-900/6 blur-3xl dark:bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(59,130,246,0.12),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_64%,rgba(14,165,233,0.14),transparent_42%)]" />
          <div className="absolute inset-y-10 left-8 w-1/3 rotate-6 rounded-full bg-white/18 blur-3xl dark:bg-white/6" />
        </div>

        <motion.div
          className="relative aspect-[5/3] w-full max-w-3xl origin-center"
          animate={{
            y: [-3, 5, -3],
            rotate: [-0.25, 0.15, -0.25],
            scale: zoom,
          }}
          transition={{
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.2, ease: "easeOut" },
          }}
          style={{ willChange: "transform" }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/92 via-white to-slate-50/90 shadow-[0_22px_48px_-32px_rgba(15,23,42,0.58)] ring-1 ring-slate-200/70 backdrop-blur-sm dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-950/85 dark:ring-slate-800/70" />
          <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(ellipse_at_bottom,rgba(15,23,42,0.1),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.38),transparent_62%)]" />
          <div className="absolute inset-0 rounded-[28px] border border-white/50 dark:border-white/5" />

          {/* Base */}
          <Image
            src="/sneaker/base.svg"
            alt="Sneaker base"
            fill
            className="object-contain drop-shadow-[0_22px_50px_rgba(15,23,42,0.24)]"
          />

          {/* Upper */}
          <Image
            src="/sneaker/upper.svg"
            alt="Upper"
            fill
            className="object-contain mix-blend-multiply"
            style={{ filter: `drop-shadow(0 0 0 ${colors.upper})` }}
          />

          {/* Sole */}
          <Image
            src="/sneaker/sole.svg"
            alt="Sole"
            fill
            className="object-contain mix-blend-multiply"
            style={{ filter: `drop-shadow(0 0 0 ${colors.sole})` }}
          />

          {/* Laces */}
          <Image
            src="/sneaker/laces.svg"
            alt="Laces"
            fill
            className="object-contain mix-blend-multiply"
            style={{ filter: `drop-shadow(0 0 0 ${colors.laces})` }}
          />

          {/* Engraved Text */}
          {engravedText && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-900 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.55)] ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-900/78 dark:text-slate-100 dark:ring-white/6">
              {engravedText}
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="mx-auto flex w-full max-w-[900px] items-center gap-5 rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-900/80">

        {/* Label */}
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Zoom
        </span>

        {/* Zoom Controls */}
        <div className="flex w-full items-center gap-4">

          {/* Minus */}
          <button
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.05).toFixed(2)))}
            className="rounded-full border border-slate-300/60 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            −
          </button>

          {/* Slider */}
          <div className="relative flex-1 rounded-full bg-slate-100/80 px-4 py-2 shadow-inner ring-1 ring-slate-200/70 dark:bg-slate-800/60 dark:ring-slate-700/70">
            <Slider
              min={0.6}
              max={1.3}
              step={0.01}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              aria-label="Zoom"
              className="relative"
            />
          </div>

          {/* Plus */}
          <button
            onClick={() => setZoom((z) => Math.min(1.3, +(z + 0.05).toFixed(2)))}
            className="rounded-full border border-slate-300/60 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            +
          </button>

          {/* Value */}
          <span className="w-[60px] text-right text-sm font-medium text-slate-600 dark:text-slate-300">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>
        
        <Button onClick={handleExport} variant="default" size="sm">
          Export PNG
        </Button>
      </div>
    </div>
  )
}
