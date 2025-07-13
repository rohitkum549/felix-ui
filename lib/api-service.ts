// Felix Blockchain API Service Layer
class FelixApiService {
  private baseURL = "https://api.felix.blockchain.com"
  private stellarEndpoint = "https://horizon.stellar.org"
  private token: string | null = null

  setAuthToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "X-Felix-Version": "1.0",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`Felix API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request("/dashboard/blockchain-stats")
  }

  async getBlueDollarBalance() {
    return this.request("/wallet/bluedollar-balance")
  }

  async getRecentTransactions() {
    return this.request("/transactions/recent")
  }

  // CoE & Projects APIs
  async getCoEServices() {
    return this.request("/coe/services")
  }

  async getProjectServices() {
    return this.request("/projects/services")
  }

  async createServiceOffer(serviceData: any) {
    return this.request("/services/create-offer", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  // Blockchain Wallet APIs
  async getWalletBalance() {
    return this.request("/wallet/stellar-balance")
  }

  async getBlueDollarTransactions() {
    return this.request("/wallet/bluedollar-transactions")
  }

  async createMultiSigRequest(requestData: any) {
    return this.request("/wallet/multisig-request", {
      method: "POST",
      body: JSON.stringify(requestData),
    })
  }

  // Service Marketplace APIs
  async getMarketplaceServices() {
    return this.request("/marketplace/services")
  }

  async purchaseService(serviceId: string, paymentData: any) {
    return this.request(`/marketplace/purchase/${serviceId}`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  // Asset Management APIs
  async getAssetPortfolio() {
    return this.request("/assets/portfolio")
  }

  async transferAsset(assetData: any) {
    return this.request("/assets/transfer", {
      method: "POST",
      body: JSON.stringify(assetData),
    })
  }

  // Settings APIs
  async getBlockchainSettings() {
    return this.request("/settings/blockchain")
  }

  async updateWalletSettings(settings: any) {
    return this.request("/settings/wallet", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }
}

export const felixApi = new FelixApiService()
