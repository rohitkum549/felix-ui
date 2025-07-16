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

  async getTransactionsByUser(userId: string) {
    const endpoint = `/api/transactions/by-user?user_id=${userId}&status=completed`
    return this.request(endpoint)
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

  async getWalletAmounts(userSecret: string) {
    const url = `${this.baseURL}/api/wallets/amounts?userSecret=${userSecret}`
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
        console.error('Wallet API error:', errorData)
        throw new Error(errorData.error || `Failed to fetch wallet amounts: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error fetching wallet amounts:', error)
      throw error
    }
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

  async getProposals(requestId: string) {
    const url = `${this.baseURL}/api/services/get/propose?request_id=${requestId}`
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
        console.error('Proposals API error:', errorData)
        throw new Error(errorData.error || `Failed to fetch proposals: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error fetching proposals:', error)
      throw error
    }
  }

  async submitProposal(proposalData: {
    requestId: string
    providerKey: string
    proposalText: string
    bidAmount: number
  }) {
    const url = `${this.baseURL}/api/services/propose`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify(proposalData),
    }
    
    console.log('API Request URL:', url)
    console.log('API Request Body:', JSON.stringify(proposalData, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Submit proposal API error:', errorData)
        throw new Error(errorData.error || `Failed to submit proposal: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error submitting proposal:', error)
      throw error
    }
  }

  async acceptProposal(proposalId: string) {
    const url = `${this.baseURL}/api/services/accept-proposal`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ proposalId }),
    }
    
    console.log('API Request URL:', url)
    console.log('API Request Body:', JSON.stringify({ proposalId }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Accept proposal API error:', errorData)
        throw new Error(errorData.error || `Failed to accept proposal: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error accepting proposal:', error)
      throw error
    }
  }

  async rejectProposal(proposalId: string) {
    const url = `${this.baseURL}/api/services/reject-proposal`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ proposalId }),
    }
    
    console.log('API Request URL:', url)
    console.log('API Request Body:', JSON.stringify({ proposalId }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Reject proposal API error:', errorData)
        throw new Error(errorData.error || `Failed to reject proposal: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error rejecting proposal:', error)
      throw error
    }
  }

  async payProposal(proposalId: string, clientSecret: string) {
    const url = `${this.baseURL}/api/services/pay`
    const bdIssuer = process.env.NEXT_PUBLIC_BDISSUER || process.env.NEXT_BDISSUER
    
    if (!bdIssuer) {
      throw new Error('BD Issuer not configured in environment variables')
    }
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ 
        proposalId, 
        clientSecret, 
        bdIssuer 
      }),
    }
    
    console.log('API Request URL:', url)
    console.log('API Request Body:', JSON.stringify({ proposalId, clientSecret: '[REDACTED]', bdIssuer }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Pay proposal API error:', errorData)
        throw new Error(errorData.error || `Failed to pay proposal: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error paying proposal:', error)
      throw error
    }
  }

  async deleteProposal(proposalId: string) {
    const url = `${this.baseURL}/api/services/delete-proposal`
    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ proposalId }),
    }
    
    console.log('API Request URL:', url)
    console.log('API Request Body:', JSON.stringify({ proposalId }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete proposal API error:', errorData)
        throw new Error(errorData.error || `Failed to delete proposal: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error deleting proposal:', error)
      throw error
    }
  }

  async purchaseService(serviceId: string, paymentData: any) {
    return this.request(`/marketplace/purchase/${serviceId}`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  async payForMemo(memoId: string, buyerSecret: string) {
    const url = `${this.baseURL}/api/memos/pay-for-memo`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memoId, buyerSecret }),
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Payment API error:', errorData)
        throw new Error(errorData.error || `Failed to process payment: ${response.statusText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error processing payment:', error)
      throw error
    }
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

  async sendMoney(sendRequest: { senderSecret: string; receiverPublic: string; amount: string }) {
    const url = `${this.baseURL}/api/wallets/BdPayment`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify(sendRequest),
    }
    
    console.log('Send Money API Request URL:', url)
    console.log('Send Money API Request Body:', JSON.stringify(sendRequest, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Send money API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to send money: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Send Money API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error sending money:', error)
      throw error
    }
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
  
// User Management APIs
  async getAllUsers() {
    const url = `${this.baseURL}/api/users`
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    }
    
    console.log('Get All Users API Request URL:', url)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Get all users API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fetch users: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Get All Users API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }

  async getUsersByGroup(groupId: string) {
    const url = `${this.baseURL}/api/users/group?groupId=${groupId}`
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    }
    
    console.log('Get Users By Group API Request URL:', url)
    console.log('Get Users By Group API Request GroupId:', groupId)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Get users by group API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fetch users: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Get Users By Group API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error fetching users by group:', error)
      throw error
    }
  }

  async fundWallet(publicKey: string) {
    const url = `${this.baseURL}/api/users/fund-wallet`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ publicKey }),
    }
    
    console.log('Fund Wallet API Request URL:', url)
    console.log('Fund Wallet API Request Body:', JSON.stringify({ publicKey }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Fund wallet API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fund wallet: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Fund Wallet API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error funding wallet:', error)
      throw error
    }
  }

  async createUser(userData: {
    username: string
    email: string
    role: string
    password: string
    entity_belongs_to: string
    entity_manager: string
  }) {
    const url = `${this.baseURL}/api/users/create`
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify(userData),
    }
    
    console.log('Create User API Request URL:', url)
    console.log('Create User API Request Body:', JSON.stringify(userData, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create user API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to create user: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Create User API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
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
