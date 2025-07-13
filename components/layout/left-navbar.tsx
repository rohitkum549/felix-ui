"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Blocks,
  Shield,
  LogOut,
} from "lucide-react"

interface NavItem {
  icon: any
  label: string
  path: string
  badge?: number
  description?: string
  requiredRoles?: string[]
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", description: "Overview & Analytics" },
  {
    icon: ShoppingBag,
    label: "Service Marketplace",
    path: "/marketplace",
    badge: 5,
    description: "CoE & Project Services",
  },
  {
    icon: Users,
    label: "Member Management",
    path: "/users",
    description: "Team & Access Control",
    requiredRoles: ["coe-admin", "project-admin"],
  },
  { icon: Wallet, label: "BlueDollar Wallet", path: "/wallet", description: "Digital Currency Management" },
  { icon: CreditCard, label: "Transactions", path: "/transactions", description: "Blockchain History" },
  { icon: Blocks, label: "Asset Portfolio", path: "/assets", description: "Multi-Asset Management" },
  {
    icon: Shield,
    label: "Multi-Signature",
    path: "/multisig",
    badge: 2,
    description: "Advanced Security",
    requiredRoles: ["coe-admin", "project-admin"],
  },
  { icon: Settings, label: "Platform Settings", path: "/settings", description: "Configuration" },
]

interface LeftNavbarProps {
  activeItem: string
  onItemClick: (path: string) => void
}

export function LeftNavbar({ activeItem, onItemClick }: LeftNavbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { user, logout, hasRole } = useAuth()

  const handleLogout = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("🔥 Logout button clicked!")
    
    try {
      // Clear any local storage tokens first
      localStorage.removeItem("felix_access_token")
      localStorage.removeItem("felix_refresh_token")
      localStorage.removeItem("felix_user_info")
      
      // Direct window location redirect to Keycloak logout
      const keycloakLogoutUrl = "https://iam-uat.cateina.com/realms/Cateina_Felix_Op/protocol/openid-connect/logout"
      const redirectUri = encodeURIComponent("http://localhost:3000")
      
      console.log("🔥 Redirecting to:", `${keycloakLogoutUrl}?redirect_uri=${redirectUri}`)
      
      // Redirect directly to Keycloak logout page
      window.location.href = `${keycloakLogoutUrl}?redirect_uri=${redirectUri}`
    } catch (error) {
      console.error("Logout failed:", error)
      alert("Logout failed. Please try again.")
    }
  }

  // Filter nav items based on user roles
  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true
    }
    return item.requiredRoles.some((role) => hasRole(role))
  })

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isCollapsed ? "w-20" : "w-80",
      )}
    >
      <GlassCard
        variant="blockchain"
        className="h-full rounded-none rounded-r-3xl border-l-0 p-6 flex flex-col"
        glow={true}
        hover={false}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-10">
          <div
            className={cn(
              "flex items-center space-x-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isCollapsed && "justify-center",
            )}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-sm"></div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col transition-all duration-300">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Felix
                </h1>
                <p className="text-xs text-white/70 font-medium">Blockchain Platform v1.0</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                <p className="text-white/60 text-xs truncate">{user.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {user.isCoEMember && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">CoE</span>
                  )}
                  {user.isProjectMember && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Project</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.path
            const isHovered = hoveredItem === item.path

            return (
              <div key={item.path} className="relative">
                <Button
                  variant="ghost"
                  onClick={() => onItemClick(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full justify-start h-14 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    "transform-gpu will-change-transform",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-white border border-blue-400/30 shadow-lg scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/8 hover:scale-[1.01]",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full transition-all duration-300" />
                  )}

                  {/* Background glow effect */}
                  {(isActive || isHovered) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl transition-opacity duration-300" />
                  )}

                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300 transform-gpu",
                      isActive && "text-blue-400 scale-110",
                      isCollapsed ? "mr-0" : "mr-4",
                    )}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-sm block">{item.label}</span>
                      <span className="text-xs text-white/50 block">{item.description}</span>
                    </div>
                  )}
                  {!isCollapsed && item.badge && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                      {item.badge}
                    </div>
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && isHovered && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-black/90 backdrop-blur-xl text-white text-sm rounded-xl border border-white/20 whitespace-nowrap shadow-2xl">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-white/70">{item.description}</div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/90 rotate-45 border-l border-b border-white/20"></div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full bg-red-600/20 text-red-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all duration-300 hover:scale-[1.02] h-12 cursor-pointer z-10 relative",
              isCollapsed ? "justify-center px-0" : "justify-start px-4",
            )}
            onMouseEnter={() => console.log("🔥 Logout button hovered")}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="font-semibold">Logout</span>}
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
