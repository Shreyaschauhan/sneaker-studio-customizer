"use client"

import { Button } from "@/components/ui/button"

interface Props {
  value: "leather" | "canvas"
  onChange: (value: "leather" | "canvas") => void
}

export function MaterialToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {(["leather", "canvas"] as const).map((material) => (
        <Button
          key={material}
          variant={value === material ? "default" : "outline"}
          onClick={() => onChange(material)}
          className="h-11 rounded-xl border-slate-200/70 bg-white/80 text-sm capitalize shadow-sm transition-all hover:-translate-y-[1px] hover:border-slate-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-200 data-[state=on]:border-transparent data-[state=on]:shadow-md dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:focus-visible:ring-slate-700"
        >
          {material}
        </Button>
      ))}
    </div>
  )
}
