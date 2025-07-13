"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService } from "@/services/auth.service"
// import KeycloakService from "@/lib/keycloak"

interface User {
  id: string
  username: string
  email: string
  fullName: string
  roles: string[]
  isCoEMember: boolean
  isProjectMember: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: () => Promise<void>
  hasRole: (role: string) => boolean
  hasResourceRole: (role: string, resource: string) => boolean
  getToken: () => string | undefined
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // const keycloakService = KeycloakService.getInstance()

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    setIsLoading(true)
    try {
      // Initialize auth service from storage
      authService.initializeFromStorage()
      
      if (authService.isAuthenticated()) {
        // Get user data from localStorage
        const storedUser = authService.getUserFromStorage()
        if (storedUser) {
          setIsAuthenticated(true)
          setUser(storedUser)
        } else {
          // If no user data found, logout to clear invalid state
          await authService.logout()
          setIsAuthenticated(false)
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Clear invalid token
      await authService.logout()
    } finally {
      setIsLoading(false)
    }
  }

  // const initializeAuth = async () => {
  //   try {
  //     setIsLoading(true)
  //     console.log("🔄 Starting authentication initialization...")

  //     const authenticated = await keycloakService.init()
  //     console.log("🔐 Authentication result:", authenticated)

  //     if (authenticated) {
  //       await loadUserProfile()
  //       setIsAuthenticated(true)
  //       console.log("✅ User authenticated and profile loaded")
  //     } else {
  //       console.log("❌ User not authenticated")
  //       setIsAuthenticated(false)
  //     }
  //   } catch (error) {
  //     console.error("❌ Authentication initialization failed:", error)
  //     setIsAuthenticated(false)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const loadUserProfile = async () => {
  //   try {
  //     const userInfo = keycloakService.getUserInfo()
  //     const username = keycloakService.getUsername()
  //     const email = keycloakService.getEmail()
  //     const fullName = keycloakService.getFullName()

  //     console.log("👤 User info:", { userInfo, username, email, fullName })

  //     // Extract roles from token
  //     const realmRoles = userInfo?.realm_access?.roles || []
  //     const resourceRoles = userInfo?.resource_access || {}

  //     const user: User = {
  //       id: userInfo?.sub || "",
  //       username: username || "",
  //       email: email || "",
  //       fullName: fullName || username || "",
  //       roles: realmRoles,
  //       isCoEMember: realmRoles.includes("coe-member") || realmRoles.includes("coe-admin"),
  //       isProjectMember: realmRoles.includes("project-member") || realmRoles.includes("project-admin"),
  //     }

  //     console.log("👤 Processed user:", user)
  //     setUser(user)
  //   } catch (error) {
  //     console.error("❌ Failed to load user profile:", error)
  //   }
  // }

  // Local user state for demo
  // const [localUser, setLocalUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const authResponse = await authService.login({ email, password })
      
      // Use the user data from the auth response
      const user: User = authResponse.user || {
        id: "1",
        username: email.split('@')[0],
        email: email,
        fullName: email.split('@')[0],
        roles: ["user"],
        isCoEMember: false,
        isProjectMember: false,
      }
      
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = async () => {
    // For now, just resolve
    return
  }

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false
  }

  const hasResourceRole = (role: string, resource: string): boolean => {
    return false
  }

  const getToken = (): string | undefined => {
    return authService.getToken() || undefined
  }

  const refreshToken = async (): Promise<boolean> => {
    return false
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    hasRole,
    hasResourceRole,
    getToken,
    refreshToken,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
