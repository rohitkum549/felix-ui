import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "premium" | "ultra" | "blockchain"
  hover?: boolean
  glow?: boolean
}

export function GlassCard({ children, className, variant = "default", hover = true, glow = false }: GlassCardProps) {
  const variants = {
    default: "bg-white/8 backdrop-blur-md border border-white/15",
    premium: "bg-gradient-to-br from-white/12 to-white/4 backdrop-blur-xl border border-white/25",
    ultra: "bg-gradient-to-br from-white/15 via-white/8 to-transparent backdrop-blur-2xl border border-white/30",
    blockchain:
      "bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent backdrop-blur-2xl border border-blue-400/20",
  }

  return (
    <div
      className={cn(
        "rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden",
        "will-change-transform transform-gpu",
        variants[variant],
        hover && "hover:scale-[1.01] hover:shadow-2xl hover:bg-white/12 hover:border-white/35",
        glow && "shadow-[0_0_50px_rgba(59,130,246,0.15)]",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-blue-500/5 before:opacity-0 before:transition-opacity before:duration-500 before:pointer-events-none",
        hover && "hover:before:opacity-100",
        className,
      )}
      style={{
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.15),
          0 8px 24px -8px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05)
        `,
      }}
    >
      {children}
    </div>
  )
}
