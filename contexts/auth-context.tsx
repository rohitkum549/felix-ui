"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import KeycloakService from "@/lib/keycloak"
import { profileService } from "@/lib/profile-service"

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
  login: () => Promise<void>
  logout: () => Promise<void>
  register: () => Promise<void>
  hasRole: (role: string) => boolean
  hasResourceRole: (role: string, resource: string) => boolean
  isAdmin: () => boolean
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
  const keycloakService = KeycloakService.getInstance()

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      console.log("🔑 Initializing Keycloak authentication...")
      const authenticated = await keycloakService.init()
      console.log("🔑 Keycloak init result:", authenticated)
      
      if (authenticated || keycloakService.isAuthenticated()) {
        console.log("✅ User is authenticated, loading profile...")
        await loadUserProfile()
        setIsAuthenticated(true)
        console.log("✅ Authentication successful")
      } else {
        console.log("❌ User is not authenticated")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("❌ Authentication initialization failed:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      const userInfo = keycloakService.getUserInfo()
      const username = keycloakService.getUsername()
      const email = keycloakService.getEmail()
      const fullName = keycloakService.getFullName()
      const realmRoles = userInfo?.realm_access?.roles || []
      const user: User = {
        id: userInfo?.sub || "",
        username: username || "",
        email: email || "",
        fullName: fullName || username || "",
        roles: realmRoles,
        isCoEMember: realmRoles.includes("coe-member") || realmRoles.includes("coe-admin"),
        isProjectMember: realmRoles.includes("project-member") || realmRoles.includes("project-admin"),
      }
      setUser(user)
    } catch (error) {
      setUser(null)
    }
  }

  const login = async () => {
    setIsLoading(true)
    try {
      await keycloakService.login()
      // After login, reload profile and set isAuthenticated
      await loadUserProfile()
      setIsAuthenticated(true)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
await keycloakService.logout()
      setUser(null)
      setIsAuthenticated(false)
      // Clear all tokens and storage
      localStorage.removeItem("felix_access_token")
      localStorage.removeItem("felix_refresh_token")
      localStorage.removeItem("felix_user_info")
      
      // Clear session storage items
      sessionStorage.removeItem("felix_profile_data")
      sessionStorage.removeItem("felix_profile_loaded")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async () => {
    setIsLoading(true)
    try {
      await keycloakService.register()
    } finally {
      setIsLoading(false)
    }
  }

  const hasRole = (role: string): boolean => {
    return keycloakService.hasRole(role)
  }

  const hasResourceRole = (role: string, resource: string): boolean => {
    return keycloakService.hasResourceRole(role, resource)
  }

  const isAdmin = (): boolean => {
    try {
      const profileData = profileService.getProfileFromSession()
      return profileData?.role === "Admin"
    } catch (error) {
      console.error("Error checking admin role:", error)
      return false
    }
  }

  const getToken = (): string | undefined => {
    return keycloakService.getToken()
  }

  const refreshToken = async (): Promise<boolean> => {
    return keycloakService.updateToken()
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
    isAdmin,
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
