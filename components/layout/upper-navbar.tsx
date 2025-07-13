"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, MessageSquare, Sun, Moon, ChevronDown, Zap, Shield, Activity } from "lucide-react"

interface UpperNavbarProps {
  title: string
  isCollapsed: boolean
}

export function UpperNavbar({ title, isCollapsed }: UpperNavbarProps) {
  const [isDark, setIsDark] = useState(true)

  return (
    <div
      className={`fixed top-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? "left-20" : "left-80"}`}
    >
      <GlassCard
        variant="blockchain"
        className="rounded-none rounded-b-3xl border-t-0 p-6 flex items-center justify-between"
        glow={true}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-white/70 text-sm font-medium">Stellar Blockchain • BlueDollar Network</p>
          </div>

          {/* Blockchain Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-green-500/20 border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-semibold">Network Active</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-semibold">Fast Sync</span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        {/* Removed search bar section as per request */}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 relative transition-all duration-300 hover:scale-110"
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
