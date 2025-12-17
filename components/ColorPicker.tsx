"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-sm transition-colors hover:border-slate-200 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-16 cursor-pointer overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 p-1 shadow-sm transition hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:focus-visible:ring-slate-700"
        />
      </div>
    </div>
  )
}
