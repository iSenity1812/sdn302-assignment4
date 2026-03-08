"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative backdrop-blur-3xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl overflow-hidden",
        className
      )}
      style={{
        boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 p-8">{children}</div>
    </motion.div>
  )
}
