"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useCustomizerStore } from "@/store/useCustomizerStore"

export function SneakerPreview() {
  const { colors, engravedText } = useCustomizerStore()

  return (
    <motion.div
      className="relative w-[420px] h-[260px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Base */}
      <Image
        src="/sneaker/base.png"
        alt="Sneaker base"
        fill
        className="object-contain"
      />

      {/* Upper */}
      <Image
        src="/sneaker/upper.png"
        alt="Upper"
        fill
        className="object-contain mix-blend-multiply"
        style={{ filter: `drop-shadow(0 0 0 ${colors.upper})` }}
      />

      {/* Sole */}
      <Image
        src="/sneaker/sole.png"
        alt="Sole"
        fill
        className="object-contain mix-blend-multiply"
        style={{ filter: `drop-shadow(0 0 0 ${colors.sole})` }}
      />

      {/* Laces */}
      <Image
        src="/sneaker/laces.png"
        alt="Laces"
        fill
        className="object-contain mix-blend-multiply"
        style={{ filter: `drop-shadow(0 0 0 ${colors.laces})` }}
      />

      {/* Engraved Text */}
      {engravedText && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold">
          {engravedText}
        </div>
      )}
    </motion.div>
  )
}
