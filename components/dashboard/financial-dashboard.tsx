"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
  Send,
  Download,
  RefreshCw
} from "lucide-react"
import { felixApi } from "@/lib/api-service"
import { getUserSecret, formatBalance } from "@/lib/wallet-service"

interface WalletData {
  public_key: string
  balances: {
    xlm: string
    bd: string
  }
  has_bd_trustline: boolean
  account_id: string
  user_info: {
    found_in_database: boolean
    username: string
    email: string
  }
}

export function FinancialDashboard() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get user secret from our wallet service
      const userSecret = getUserSecret()
      
      if (!userSecret) {
        setError("No wallet credentials found. Please login again.")
        return
      }
      
      // Call the wallet API
      const data = await felixApi.getWalletAmounts(userSecret)
      setWalletData(data)
    } catch (err) {
      setError("Failed to load wallet data. Please try again later.")
      console.error("Wallet API error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFormattedBalance = () => {
    if (!walletData || !walletData.balances) return "0.00"
    return formatBalance(walletData.balances.bd, 2)
  }

  return (
    <div className="w-full">
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Total Balance</h2>
              <p className="text-gray-400">Main Wallet</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={loadWalletData}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                disabled={loading}
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-800 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-32"></div>
              </div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : (
              <>
                <p className="text-4xl font-bold text-white mb-2">
                  {showBalance ? `${getFormattedBalance()} BD` : "••••••"}
                </p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold">+12.5%</span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Receive
            </Button>
          </div>
        </CardContent>
      </Card>

      {!loading && walletData && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Public Key</span>
                  <span className="text-white truncate max-w-[180px]">{walletData.public_key.substring(0, 8)}...{walletData.public_key.substring(walletData.public_key.length - 4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XLM Balance</span>
                  <span className="text-white">{parseFloat(walletData.balances.xlm).toFixed(4)} XLM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">BD Trustline</span>
                  <span className={walletData.has_bd_trustline ? "text-green-400" : "text-red-400"}>
                    {walletData.has_bd_trustline ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">User Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username</span>
                  <span className="text-white">{walletData.user_info.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{walletData.user_info.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Transactions - Placeholder */}
      <Card className="bg-gray-900 border-gray-800 mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Transactions</h3>
          
          {/* Mock transaction items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-400">
                  <ArrowDownLeft className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-medium">Received Payment</p>
                  <p className="text-gray-400 text-sm">Today, 10:45 AM</p>
                </div>
              </div>
              <span className="text-green-400 font-semibold">+25.00 BD</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-medium">Sent Payment</p>
                  <p className="text-gray-400 text-sm">Yesterday, 3:20 PM</p>
                </div>
              </div>
              <span className="text-red-400 font-semibold">-12.50 BD</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
