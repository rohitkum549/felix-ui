// Felix Blockchain API Service Layer
class FelixApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
  private stellarEndpoint = process.env.NEXT_PUBLIC_STELLAR_ENDPOINT || 'https://horizon.stellar.org'
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

  async getAllServices(limit: number = 10, offset: number = 0) {
    const url = `${this.baseURL}/api/services/all?limit=${limit}&offset=${offset}`
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Services API error:', errorData)
        throw new Error(errorData.error || `Failed to fetch services: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
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
  
// User Profile APIs
  async fetchUserProfile(email: string, retryCount = 0, maxRetries = 3) {
    // Use API base URL from environment for profile
    const url = `${this.baseURL}/api/fetch/profile`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ email }),
    }
    
    try {
      const response = await fetch(url, config)
      
      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Profile API error:', errorData)
        throw new Error(errorData.error || `Failed to fetch profile: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Validate response format
      if (!data || !data.user) {
        throw new Error('Invalid profile response format')
      }
      
      return data
    } catch (error) {
      // Implement retry logic with exponential backoff
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying profile fetch (${retryCount + 1}/${maxRetries}) after ${delay}ms`)
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.fetchUserProfile(email, retryCount + 1, maxRetries))
          }, delay)
        })
      }
      
      throw error
    }
  }
}

export const felixApi = new FelixApiService()
