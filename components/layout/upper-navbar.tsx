"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, Zap } from "lucide-react"

interface UpperNavbarProps {
  title: string
  isCollapsed: boolean
}

export function UpperNavbar({ title, isCollapsed }: UpperNavbarProps) {
  const [isDark, setIsDark] = useState(true)
  const [role, setRole] = useState("User")

  useEffect(() => {
    const userInfo = localStorage.getItem("felix_user_info")
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo)
        const roles = parsedUserInfo?.realm_access?.roles || []
        if (roles.some((role) => role.includes("-admin"))) {
          setRole("Admin")
        } else if (roles.includes("viewer")) {
          setRole("View Only")
        } else if (roles.includes("user")) {
          setRole("User")
        }
      } catch (error) {
        console.error("Failed to parse user info:", error)
      }
    }
  }, [])

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

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl px-4 h-12 transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full mr-3 shadow-lg"></div>
                <span className="hidden md:block font-semibold">{role}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 backdrop-blur-2xl border-white/20 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl">Wallet Security</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl">Blockchain Logs</DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 rounded-xl">Secure Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </GlassCard>
    </div>
  )
}
