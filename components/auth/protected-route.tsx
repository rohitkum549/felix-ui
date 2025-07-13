"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "./login-page"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredResourceRoles?: { role: string; resource: string }[]
}

export function ProtectedRoute({ children, requiredRoles = [], requiredResourceRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasResourceRole } = useAuth()

  console.log("🛡️ ProtectedRoute - isAuthenticated:", isAuthenticated, "isLoading:", isLoading)

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-white font-bold text-3xl">F</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Felix Platform
          </h1>
          <p className="text-white/60 text-lg mb-8">Connecting to Keycloak...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    console.log("🔒 User not authenticated, showing login page")
    return <LoginPage />
  }

  // Check required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role))
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-white/60 text-lg">You don't have the required permissions to access this page.</p>
            <p className="text-white/40 text-sm mt-2">Required roles: {requiredRoles.join(", ")}</p>
          </div>
        </div>
      )
    }
  }

  // Check required resource roles
  if (requiredResourceRoles.length > 0) {
    const hasRequiredResourceRole = requiredResourceRoles.some(({ role, resource }) => hasResourceRole(role, resource))
    if (!hasRequiredResourceRole) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-white/60 text-lg">You don't have the required resource permissions.</p>
          </div>
        </div>
      )
    }
  }

  console.log("✅ User authenticated and authorized, showing protected content")
  return <>{children}</>
}
