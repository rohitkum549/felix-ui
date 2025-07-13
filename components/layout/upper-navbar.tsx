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
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 group-focus-within:text-blue-400 transition-colors duration-300" />
            <Input
              placeholder="Search services, transactions, members..."
              className="pl-12 pr-4 h-12 bg-white/8 border-white/20 text-white placeholder:text-white/50 rounded-2xl backdrop-blur-sm focus:bg-white/12 focus:border-blue-400/50 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* BlueDollar Balance */}
          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">B$</span>
            </div>
            <span className="text-white font-semibold">12,547.89</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 transition-all duration-300 hover:scale-110"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Blockchain Security Status */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 relative transition-all duration-300 hover:scale-110"
          >
            <Shield className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
          </Button>

          {/* Activity Monitor */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 relative transition-all duration-300 hover:scale-110"
          >
            <Activity className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 relative transition-all duration-300 hover:scale-110"
          >
            <MessageSquare className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          </Button>

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
                <span className="hidden md:block font-semibold">CoE Admin</span>
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
