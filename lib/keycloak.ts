// Keycloak integration is disabled for now. All code commented out.
/*
import Keycloak from "keycloak-js"

// Debug logging
const DEBUG = true // Always enable for troubleshooting

// Keycloak configuration with your updated realm
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://iam-uat.cateina.com/",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "Cateina_Felix_Realm",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "felix-ui-client",
}

if (DEBUG) {
  console.log("🔐 Keycloak Config:", keycloakConfig)
  console.log("🌐 Current URL:", typeof window !== "undefined" ? window.location.href : "Server-side")
}

// Initialize Keycloak instance
let keycloak: Keycloak | null = null

// Function to get or create Keycloak instance
const getKeycloakInstance = () => {
  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig)
  }
  return keycloak
}

// Keycloak initialization options - MANUAL LOGIN APPROACH
const initOptions = {
  onLoad: "login-required" as const, // Changed back to check-sso for manual login
  silentCheckSsoRedirectUri: typeof window !== "undefined" ? `${window.location.origin}/silent-check-sso.html` : "",
  checkLoginIframe: true, // Disable iframe to avoid CORS issues
  pkceMethod: "S256" as const,
  enableLogging: DEBUG,
  messageReceiveTimeout: 10000,
  responseMode: "fragment" as const, // Use fragment mode to avoid CORS issues
}

class KeycloakService {
  private static instance: KeycloakService
  private keycloakInstance: Keycloak
  private isInitialized = false

  private constructor() {
    this.keycloakInstance = getKeycloakInstance()
  }

  public static getInstance(): KeycloakService {
    if (!KeycloakService.instance) {
      KeycloakService.instance = new KeycloakService()
    }
    return KeycloakService.instance
  }

  public async init(): Promise<boolean> {
    try {
      if (DEBUG) {
        console.log("🚀 Initializing Keycloak with options:", initOptions)
        console.log("🔗 Keycloak URL Test:", `${keycloakConfig.url}realms/${keycloakConfig.realm}`)
      }

      // Test Keycloak connectivity first
      await this.testKeycloakConnectivity()

      const authenticated = await this.keycloakInstance.init(initOptions)
      this.isInitialized = true

      if (DEBUG) {
        console.log("✅ Keycloak initialized. Authenticated:", authenticated)
        if (authenticated) {
          console.log("🎫 Token:", this.keycloakInstance.token?.substring(0, 50) + "...")
          console.log("👤 User Info:", this.keycloakInstance.tokenParsed)
        }
      }

      // Store token in localStorage if authenticated
      if (authenticated && this.keycloakInstance.token) {
        this.storeTokens()
      }

      // Set up token refresh only if authenticated
      if (authenticated) {
        this.setupTokenRefresh()
      }

      return authenticated
    } catch (error) {
      console.error("❌ Keycloak initialization failed:", error)

      // Provide specific error guidance
      if (error instanceof Error) {
        if (error.message.includes("CORS")) {
          console.error("🚨 CORS Error: Check Keycloak client configuration")
        } else if (error.message.includes("401")) {
          console.error("🚨 401 Error: Check realm name and client ID")
        } else if (error.message.includes("404")) {
          console.error("🚨 404 Error: Check Keycloak URL and realm name")
        }
      }

      throw error
    }
  }

  private async testKeycloakConnectivity(): Promise<void> {
    try {
      const testUrl = `${keycloakConfig.url}realms/${keycloakConfig.realm}/.well-known/openid_configuration`
      if (DEBUG) {
        console.log("🧪 Testing Keycloak connectivity:", testUrl)
      }

      const response = await fetch(testUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Keycloak connectivity test failed: ${response.status} ${response.statusText}`)
      }

      const config = await response.json()
      if (DEBUG) {
        console.log("✅ Keycloak connectivity test passed:", config.issuer)
      }
    } catch (error) {
      console.error("❌ Keycloak connectivity test failed:", error)
      throw new Error("Cannot connect to Keycloak server. Please check the URL and realm name.")
    }
  }

  private storeTokens(): void {
    if (this.keycloakInstance.token) {
      localStorage.setItem("felix_access_token", this.keycloakInstance.token)
      localStorage.setItem("felix_refresh_token", this.keycloakInstance.refreshToken || "")
      localStorage.setItem("felix_user_info", JSON.stringify(this.keycloakInstance.tokenParsed))
      if (DEBUG) {
        console.log("💾 Tokens stored in localStorage")
      }
    }
  }

  private setupTokenRefresh(): void {
    // Refresh token every 4 minutes (before 5-minute expiry)
    setInterval(() => {
      this.keycloakInstance
        .updateToken(60) // Refresh if expires within 1 minute
        .then((refreshed) => {
          if (refreshed) {
            if (DEBUG) {
              console.log("🔄 Token refreshed successfully")
            }
            this.storeTokens()
          }
        })
        .catch((error) => {
          console.error("❌ Token refresh failed:", error)
          this.clearTokens()
          // Don't auto-login on refresh failure, let user manually login
        })
    }, 240000) // 4 minutes
  }

  public async login(): Promise<void> {
    try {
      if (DEBUG) {
        console.log("🔑 Initiating manual login...")
      }

      const loginOptions = {
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
        prompt: "login" as const, // Force login prompt
      }

      if (DEBUG) {
        console.log("🔑 Login options:", loginOptions)
      }

      await this.keycloakInstance.login(loginOptions)
    } catch (error) {
      console.error("❌ Login failed:", error)
      throw error
    }
  }

  public async logout(): Promise<void> {
    try {
      if (DEBUG) {
        console.log("🚪 Initiating logout...")
      }
      this.clearTokens()

      const logoutOptions = {
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      }

      await this.keycloakInstance.logout(logoutOptions)
    } catch (error) {
      console.error("❌ Logout failed:", error)
      throw error
    }
  }

  public async register(): Promise<void> {
    try {
      if (DEBUG) {
        console.log("📝 Initiating registration...")
      }

      const registerOptions = {
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      }

      await this.keycloakInstance.register(registerOptions)
    } catch (error) {
      console.error("❌ Registration failed:", error)
      throw error
    }
  }

  private clearTokens(): void {
    localStorage.removeItem("felix_access_token")
    localStorage.removeItem("felix_refresh_token")
    localStorage.removeItem("felix_user_info")
    if (DEBUG) {
      console.log("🗑️ Tokens cleared from localStorage")
    }
  }

  public isAuthenticated(): boolean {
    const keycloakAuth = !!this.keycloakInstance.authenticated && !!this.keycloakInstance.token
    const hasStoredToken = !!localStorage.getItem("felix_access_token")
    const result = keycloakAuth || hasStoredToken

    if (DEBUG) {
      console.log("🔍 Authentication check:", { keycloakAuth, hasStoredToken, result })
    }

    return result
  }

  public getToken(): string | undefined {
    return this.keycloakInstance.token || localStorage.getItem("felix_access_token") || undefined
  }

  public getRefreshToken(): string | undefined {
    return this.keycloakInstance.refreshToken || localStorage.getItem("felix_refresh_token") || undefined
  }

  public getUserInfo(): any {
    if (this.keycloakInstance.tokenParsed) {
      return this.keycloakInstance.tokenParsed
    }
    const storedInfo = localStorage.getItem("felix_user_info")
    return storedInfo ? JSON.parse(storedInfo) : null
  }

  public hasRole(role: string): boolean {
    return this.keycloakInstance.hasRealmRole(role)
  }

  public hasResourceRole(role: string, resource: string): boolean {
    return this.keycloakInstance.hasResourceRole(role, resource)
  }

  public getUsername(): string | undefined {
    const userInfo = this.getUserInfo()
    return userInfo?.preferred_username
  }

  public getEmail(): string | undefined {
    const userInfo = this.getUserInfo()
    return userInfo?.email
  }

  public getFullName(): string | undefined {
    const userInfo = this.getUserInfo()
    if (userInfo?.given_name && userInfo?.family_name) {
      return `${userInfo.given_name} ${userInfo.family_name}`
    }
    return userInfo?.name || userInfo?.preferred_username
  }

  public updateToken(minValidity = 30): Promise<boolean> {
    return this.keycloakInstance.updateToken(minValidity)
  }

  public getKeycloakInstance(): Keycloak {
    return this.keycloakInstance
  }

  public isInitialized(): boolean {
    return this.isInitialized
  }
}

export default KeycloakService
*/
