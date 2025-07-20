export interface Transaction {
  id: string
  product_id: string
  user_id: string
  table_admin_id: string
  amount: number
  currency: string
  status: string
  stellar_transaction_hash: string
  created_at: string
  updated_at: string
  receiver_id: string
  sender_id: string
}

export interface Service {
  id: string
  sender_id: string
  receiver_id: string
  amount: number
  currency: string
  price: number
  memo: string
  xdr: string | null
  status: string
  created_at: string
  updated_at: string
  stellar_transaction_hash: string
  description: string
  rating: number
}

export interface Wallet {
  // Add wallet properties based on your wallet structure
  id: string
  // Add other wallet properties as needed
}

export interface Profile {
  id: string
  username: string
  email: string
  public_key: string
  role: string
  entity_belongs: string
  entity_admin_name: string
  created_at: string | null
  updated_at: string | null
}

export interface User {
  id: string
  username: string
  email: string
  role: string
  password: string
  entity_belongs_to: string
  entity_manager: string
  public_key: string
  secret_key: string
  is_wallet_funded: boolean
  is_trustline_added: boolean
  is_bd_received: boolean
  created_at: string
}

export interface WalletBalance {
  public_key: string
  xlm_balance: string
  bd_balance: string
  has_bd_trustline: boolean
  updated_at: string
}

export interface DashboardSummary {
  total_transactions: number
  total_wallets: number
  total_tracked_balances: number
  last_updated: string
}

export interface DashboardData {
  transactions: {
    count: number
    data: Transaction[]
  }
  services: {
    count: number
    data: Service[]
  }
  wallets: {
    count: number
    data: Wallet[]
  }
  profiles: {
    count: number
    data: Profile[]
  }
  users: {
    count: number
    data: User[]
  }
  wallet_balances: {
    count: number
    data: WalletBalance[]
  }
  summary: DashboardSummary
}
