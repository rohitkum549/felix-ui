// Felix Blockchain API Service Layer with Enhanced Token Management
class FelixApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
  private stellarEndpoint = process.env.NEXT_PUBLIC_STELLAR_ENDPOINT || 'https://horizon.stellar.org'
  private token: string | null = null
  private getTokenCallback: (() => string | undefined) | null = null

  // Set the callback to get the current token from auth context
  setTokenProvider(getTokenCallback: () => string | undefined) {
    this.getTokenCallback = getTokenCallback
  }

  setAuthToken(token: string) {
    this.token = token
  }

  // Get the current access token
  private getCurrentToken(): string | undefined {
    // Priority: callback (from auth context) > manually set token
    if (this.getTokenCallback) {
      return this.getTokenCallback()
    }
    return this.token || undefined
  }

  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "X-Felix-Version": "1.0",
        ...(token && { Authorization: `Bearer ${token}` }),
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

  async getTransactionsAndWallets() {
    return this.request("/api/transactions-and-wallets")
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

  // Create Service API
  async createService(serviceData: {
    creatorKey: string
    memo: string
    bdAmount: number
    assetId: string
    description: string
    rating: number
  }) {
    return this.request("/api/memos/create", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  // Request Service API
  async requestService(requestData: {
    clientKey: string
    description: string
    budget: number
    title: string
    requirements: string
  }) {
    return this.request("/api/services/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    })
  }

  // Get Service Requests API
  async getServiceRequests() {
    return this.request("/api/services/request")
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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

  // New Asset Management APIs
  async createCustomAsset(assetData: {
    assetCode: string
    assetIssuer?: string
    description?: string
    metadata?: any
  }) {
    const url = `${this.baseURL}/api/assets`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(assetData),
    }
    
    console.log('Create Custom Asset API Request URL:', url)
    console.log('Create Custom Asset API Request Body:', JSON.stringify(assetData, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create custom asset API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to create asset: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Create Custom Asset API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error creating custom asset:', error)
      throw error
    }
  }

  async getAllAssets(filters?: {
    status?: string
    assetCode?: string
    limit?: number
    offset?: number
  }) {
    const queryParams = new URLSearchParams()
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.assetCode) queryParams.append('assetCode', filters.assetCode)
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    if (filters?.offset) queryParams.append('offset', filters.offset.toString())
    
    const url = `${this.baseURL}/api/assets${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
    
    console.log('Get All Assets API Request URL:', url)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Get all assets API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fetch assets: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Get All Assets API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error fetching all assets:', error)
      throw error
    }
  }

  async getAssetById(assetId: string) {
    const url = `${this.baseURL}/api/assets/${assetId}`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
    
    console.log('Get Asset By ID API Request URL:', url)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Get asset by ID API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fetch asset: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Get Asset By ID API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error fetching asset by ID:', error)
      throw error
    }
  }

  async toggleAssetStatus(assetId: string) {
    const url = `${this.baseURL}/api/assets/${assetId}/toggle-status`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
    
    console.log('Toggle Asset Status API Request URL:', url)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Toggle asset status API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to toggle asset status: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Toggle Asset Status API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error toggling asset status:', error)
      throw error
    }
  }

  async issueAssetToAccount(assetId: string, issueData: {
    destinationAccount: string
    amount: string
    memo?: string
  }) {
    const url = `${this.baseURL}/api/assets/${assetId}/issue`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(issueData),
    }
    
    console.log('Issue Asset To Account API Request URL:', url)
    console.log('Issue Asset To Account API Request Body:', JSON.stringify(issueData, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Issue asset to account API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to issue asset: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Issue Asset To Account API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error issuing asset to account:', error)
      throw error
    }
  }

  async sendMoney(sendRequest: { senderSecret: string; receiverPublic: string; amount: string }) {
    const url = `${this.baseURL}/api/wallets/BdPayment`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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

  async addTrustline(secretKey: string) {
    const url = `${this.baseURL}/api/users/add-trustline`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ secretKey }),
    }
    
    console.log('Add Trustline API Request URL:', url)
    console.log('Add Trustline API Request Body:', JSON.stringify({ secretKey: '[REDACTED]' }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Add trustline API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to add trustline: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Add Trustline API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error adding trustline:', error)
      throw error
    }
  }

  async sendAsset(publicKey: string, assetCode: string) {
    const url = `${this.baseURL}/api/users/send-bd`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ publicKey, assetCode }),
    }
    
    console.log('Send Asset API Request URL:', url)
    console.log('Send Asset API Request Body:', JSON.stringify({ publicKey, assetCode }, null, 2))
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Send asset API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to send asset: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Send Asset API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error sending asset:', error)
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
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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

// Entity Management APIs
  async getEntities() {
    const url = `${this.baseURL}/api/entities`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
    
    console.log('Get Entities API Request URL:', url)
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Get entities API error:', errorData)
        throw new Error(errorData.error || errorData.message || `Failed to fetch entities: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('Get Entities API Response:', responseData)
      return responseData
    } catch (error) {
      console.error('Error fetching entities:', error)
      throw error
    }
  }

  async createEntity(entityData: {
    name: string
    code: string
    description?: string
    generate_stellar_keys: boolean
  }) {
    return this.request("/api/entities", {
      method: "POST",
      body: JSON.stringify(entityData),
    })
  }

  async fetchUserProfile(email: string, retryCount = 0, maxRetries = 3) {
    // Use API base URL from environment for profile
    const url = `${this.baseURL}/api/fetch/profile`
    const token = this.getCurrentToken()
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
