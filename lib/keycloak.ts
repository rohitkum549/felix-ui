import Keycloak from "keycloak-js"

const keycloakConfig = {
  url: "https://iam-uat.cateina.com/",
  realm: "Cateina_Felix_Op",
  clientId: "felix-ui",
}

let keycloak: Keycloak | null = null

const getKeycloakInstance = () => {
  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig)
  }
  return keycloak
}

const initOptions = {
  onLoad: "login-required" as const,
  silentCheckSsoRedirectUri: typeof window !== "undefined" ? `${window.location.origin}/silent-check-sso.html` : "",
  checkLoginIframe: true,
  pkceMethod: "S256" as const,
  enableLogging: true,
  messageReceiveTimeout: 10000,
  responseMode: "fragment" as const,
}

class KeycloakService {
  private static instance: KeycloakService
  private keycloakInstance: Keycloak
  private initialized = false

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
      const authenticated = await this.keycloakInstance.init(initOptions)
      this.initialized = true
      if (authenticated && this.keycloakInstance.token) {
        this.storeTokens()
        this.setupTokenRefresh()
      }
      console.log("Keycloak initialized successfully:", authenticated ? "Authenticated" : "Not authenticated");
      return authenticated
    } catch (error) {
      throw error
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
    setInterval(() => {
      this.keycloakInstance
        .updateToken(60)
        .then((refreshed) => {
          if (refreshed) {
            this.storeTokens()
          }
        })
        .catch(() => {
          this.clearTokens()
        })
    }, 240000)
  }

  public async login(): Promise<void> {
    await this.keycloakInstance.login({
      redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      prompt: "login" as const,
    })
  }

  public async logout(): Promise<void> {
    this.clearTokens()
    await this.keycloakInstance.logout({
      redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    })
  }

  public async register(): Promise<void> {
    await this.keycloakInstance.register({
      redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    })
  }

  private clearTokens(): void {
    localStorage.removeItem("felix_access_token")
    localStorage.removeItem("felix_refresh_token")
    localStorage.removeItem("felix_user_info")
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
