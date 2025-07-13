"use client"

import { useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { LeftNavbar } from "@/components/layout/left-navbar"
import { UpperNavbar } from "@/components/layout/upper-navbar"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Marketplace } from "@/components/marketplace/marketplace"
import { UserManagement } from "@/components/users/user-management"
import { Wallet } from "@/components/wallet/wallet"
import { Transactions } from "@/components/transactions/transactions"
import { Settings } from "@/components/settings/settings"
import { useAuth } from "@/contexts/auth-context"

const pageComponents = {
  "/dashboard": Dashboard,
  "/marketplace": Marketplace,
  "/users": UserManagement,
  "/wallet": Wallet,
  "/transactions": Transactions,
  "/assets": Dashboard, // Placeholder for Asset Portfolio
  "/multisig": Dashboard, // Placeholder for Multi-Signature
  "/settings": Settings,
}

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

function FelixAppContent() {
  const [currentPage, setCurrentPage] = useState("/dashboard")
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)


  const CurrentComponent = pageComponents[currentPage as keyof typeof pageComponents]
  const currentTitle = pageTitles[currentPage as keyof typeof pageTitles]

  return (
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
      <LeftNavbar activeItem={currentPage} onItemClick={setCurrentPage} />
      <UpperNavbar title={currentTitle} isCollapsed={isNavCollapsed} />

      {/* Main Content */}
      <main
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-28 pb-12 ${isNavCollapsed ? "ml-20 mr-8" : "ml-80 mr-8"}`}
      >
        <div className="relative z-10 transform-gpu will-change-transform">
          <div className="animate-fade-in">
            <CurrentComponent />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function FelixApp() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <FelixAppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
