"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import KeycloakService from "@/lib/keycloak"

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
      const authenticated = await keycloakService.init()
      if (authenticated || keycloakService.isAuthenticated()) {
        await loadUserProfile()
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
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
