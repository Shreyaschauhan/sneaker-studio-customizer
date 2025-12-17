"use client"

import { Button } from "@/components/ui/button"

interface Props {
  value: "leather" | "canvas"
  onChange: (value: "leather" | "canvas") => void
}

export function MaterialToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {(["leather", "canvas"] as const).map((material) => (
        <Button
          key={material}
          variant={value === material ? "default" : "outline"}
          onClick={() => onChange(material)}
          className="capitalize"
        >
          {material}
        </Button>
      ))}
    </div>
  )
}
