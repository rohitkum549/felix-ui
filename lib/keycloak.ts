import Keycloak from "keycloak-js"

// Utility function to get the current app URL
const getAppUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://iam-uat.cateina.com/",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "Cateina_Felix_Op",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "felix-ui",
}

let keycloak: Keycloak | null = null

const getKeycloakInstance = () => {
  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig)
  }
  return keycloak
}

const initOptions = {
  onLoad: "check-sso" as const,
  silentCheckSsoRedirectUri: typeof window !== "undefined" ? `${window.location.origin}/silent-check-sso.html` : "",
  checkLoginIframe: false, // Disable iframe check to prevent auto-refresh
  pkceMethod: "S256" as const,
  enableLogging: true, // Enable logging for debugging
  messageReceiveTimeout: 10000,
  responseMode: "query" as const,
  checkLoginIframeInterval: 0, // Disable iframe interval check
}

class KeycloakService {
  private static instance: KeycloakService
  private keycloakInstance: Keycloak
  private initialized = false
  private tokenRefreshInterval: NodeJS.Timeout | null = null
  private initPromise: Promise<boolean> | null = null

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
    // Prevent multiple simultaneous init calls
    if (this.initPromise) {
      console.log("🔄 Keycloak init already in progress, waiting...")
      return this.initPromise
    }

    if (this.initialized) {
      console.log("✅ Keycloak already initialized")
      return this.isAuthenticated()
    }

    this.initPromise = this.performInit()
    return this.initPromise
  }

  private async performInit(): Promise<boolean> {
    let retryCount = 0
    const maxRetries = 3
    const retryDelay = 1000

    while (retryCount < maxRetries) {
      try {
        console.log(`🔑 Keycloak init attempt ${retryCount + 1}/${maxRetries}...`)
        
        // Clear any existing auth state
        this.clearAuthState()
        
        const authenticated = await this.keycloakInstance.init(initOptions)
        this.initialized = true
        
        if (authenticated && this.keycloakInstance.token) {
          console.log("✅ Keycloak authentication successful")
          this.storeTokens()
          this.setupTokenRefresh()
          return true
        } else {
          console.log("ℹ️ Keycloak initialized but user not authenticated")
          return false
        }
      } catch (error) {
        retryCount++
        console.error(`❌ Keycloak init attempt ${retryCount} failed:`, error)
        
        if (retryCount < maxRetries) {
          console.log(`⏳ Retrying in ${retryDelay}ms...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        } else {
          console.error("❌ All Keycloak init attempts failed")
          throw error
        }
      }
    }
    
    return false
  }

  private clearAuthState(): void {
    // Clear any existing Keycloak state
    if (this.keycloakInstance.authenticated) {
      this.keycloakInstance.authenticated = false
    }
    
    // Clear stored tokens if they exist
    const storedToken = localStorage.getItem("felix_access_token")
    if (storedToken) {
      console.log("🧹 Clearing stale tokens")
      this.clearTokens()
    }
  }

  private storeTokens(): void {
    if (this.keycloakInstance.token) {
      localStorage.setItem("felix_access_token", this.keycloakInstance.token)
      localStorage.setItem("felix_refresh_token", this.keycloakInstance.refreshToken || "")
      localStorage.setItem("felix_user_info", JSON.stringify(this.keycloakInstance.tokenParsed))
    }
  }
  

  private setupTokenRefresh(): void {
    // Clear any existing interval
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval)
    }
    
    // Set up token refresh every 4 minutes (240000ms)
    this.tokenRefreshInterval = setInterval(() => {
      this.keycloakInstance
        .updateToken(60)
        .then((refreshed) => {
          if (refreshed) {
            this.storeTokens()
            console.log('Token refreshed successfully')
          }
        })
        .catch((error) => {
          console.error('Token refresh failed:', error)
          this.clearTokens()
        })
    }, 240000)
  }

  public async login(): Promise<void> {
    await this.keycloakInstance.login({
      redirectUri: getAppUrl(),
      prompt: "login" as const,
    })
  }

  public async logout(): Promise<void> {
    // Clear the token refresh interval
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval)
      this.tokenRefreshInterval = null
    }
    
    // Clear all stored tokens and user data
    this.clearTokens()
    
    // Clear any additional application data
    this.clearAllApplicationData()
    
    // Logout from Keycloak with proper post_logout_redirect_uri
    await this.keycloakInstance.logout({
      redirectUri: getAppUrl(),
    })
  }

  public async register(): Promise<void> {
    await this.keycloakInstance.register({
      redirectUri: getAppUrl(),
    })
  }

  private clearTokens(): void {
    localStorage.removeItem("felix_access_token")
    localStorage.removeItem("felix_refresh_token")
    localStorage.removeItem("felix_user_info")
  }
  
  private clearAllApplicationData(): void {
    // Clear all Felix-related data from localStorage
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('felix_')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear session storage as well
    const sessionKeys = Object.keys(sessionStorage)
    sessionKeys.forEach(key => {
      if (key.startsWith('felix_')) {
        sessionStorage.removeItem(key)
      }
    })
  }

  public isAuthenticated(): boolean {
    const keycloakAuth = !!this.keycloakInstance.authenticated && !!this.keycloakInstance.token
    const hasStoredToken = !!localStorage.getItem("felix_access_token")
    return keycloakAuth || hasStoredToken
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
    return typeof this.keycloakInstance !== "undefined" && !!this.keycloakInstance.authenticated
  }
}

export default KeycloakService
