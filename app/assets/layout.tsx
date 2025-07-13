"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { LeftNavbar } from "@/components/layout/left-navbar"
import { UpperNavbar } from "@/components/layout/upper-navbar"

const pageTitles = {
  "/dashboard": "Felix Dashboard",
  "/marketplace": "Service Marketplace",
  "/users": "Member Management",
  "/wallet": "BlueDollar Wallet",
  "/transactions": "Blockchain Transactions",
  "/assets": "Asset Portfolio",
  "/multisig": "Multi-Signature",
  "/settings": "Platform Settings",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const pathname = usePathname()
  
  const currentTitle = pageTitles[pathname as keyof typeof pageTitles] || "Felix Platform"

  const handleNavClick = (path: string) => {
    // Use window.location for navigation to ensure proper routing
    window.location.href = path
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
        {/* Enhanced Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent"></div>

        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <LeftNavbar activeItem={pathname} onItemClick={handleNavClick} />
        <UpperNavbar title={currentTitle} isCollapsed={isNavCollapsed} />

        {/* Main Content */}
        <main
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-28 pb-12 ${
            isNavCollapsed ? "ml-20 mr-8" : "ml-80 mr-8"
          }`}
        >
          <div className="relative z-10 transform-gpu will-change-transform">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
