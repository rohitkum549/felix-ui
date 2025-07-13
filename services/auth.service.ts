import { felixApi } from "@/lib/api-service"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user?: {
    id: string
    email: string
    username: string
    fullName: string
    roles: string[]
    isCoEMember: boolean
    isProjectMember: boolean
  }
}

export class AuthService {
  private static instance: AuthService
  private authToken: string | null = null

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await felixApi.login(credentials.email, credentials.password)
      
      // Extract token and user data from the backend response
      const token = `Bearer ${response.user.id}` // Using user ID as token for now
      const user = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        fullName: response.user.username, // Using username as full name for now
        roles: [response.user.role || "user"],
        isCoEMember: response.user.entity_belongs === "CoE",
        isProjectMember: response.user.entity_belongs === "Project",
      }

      this.authToken = token
      felixApi.setAuthToken(token)
      
      // Store user in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return {
        token,
        user
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  async logout(): Promise<void> {
    this.authToken = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    felixApi.setAuthToken('')
  }

  getToken(): string | null {
    return this.authToken || localStorage.getItem('authToken')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  initializeFromStorage(): void {
    const token = localStorage.getItem('authToken')
    if (token) {
      this.authToken = token
      felixApi.setAuthToken(token)
    }
  }

  getUserFromStorage(): any {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        return JSON.parse(userString)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  }
}

export const authService = AuthService.getInstance()
