"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { felixApi } from "@/lib/api-service"
import { getUserSecret, formatBalance } from "@/lib/wallet-service"
import {
  WalletIcon,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  Download,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  category: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 2500.0,
    description: "Freelance Project Payment",
    date: "2024-01-15",
    status: "completed",
    category: "Work",
  },
  {
    id: "2",
    type: "expense",
    amount: 89.99,
    description: "Software Subscription",
    date: "2024-01-14",
    status: "completed",
    category: "Tools",
  },
  {
    id: "3",
    type: "income",
    amount: 1200.0,
    description: "Product Sales",
    date: "2024-01-13",
    status: "pending",
    category: "Sales",
  },
]

export function Wallet() {
  const [balance, setBalance] = useState(12547.89)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [showBalance, setShowBalance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bdBalance, setBdBalance] = useState<string>("0.00")

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setLoading(true)
    try {
      // Get user secret from our wallet service
      const userSecret = getUserSecret()
      
      if (!userSecret) {
        console.error("No wallet credentials found")
        return
      }
      
      // Call the wallet API
      const walletData = await felixApi.getWalletAmounts(userSecret)
      
      // Extract the BD balance
      if (walletData && walletData.balances && walletData.balances.bd) {
        setBdBalance(walletData.balances.bd)
        // Convert BD balance to number for display
        const bdBalanceNum = parseFloat(walletData.balances.bd)
        setBalance(bdBalanceNum)
      }
      
      // We could also update user info if needed
      // if (walletData && walletData.user_info) {
      //   // Update user information
      // }
      
      // For now, keep using mock transactions
      // In the future, you might want to implement a real transaction API
    } catch (error) {
      console.error("Failed to load wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-white/60">Manage your finances and transactions</p>
        </div>

        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Money
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent">
            <Send className="h-4 w-4 mr-2" />
            Send Money
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <GlassCard variant="ultra" className="lg:col-span-2 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <WalletIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Balance</p>
                  <p className="text-white font-medium">Main Wallet</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loadWalletData}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                  disabled={loading}
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="mb-6">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-white/10 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white mb-2">
                    {showBalance ? `BD ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}$` : "•••••• •••"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-semibold">+12.5%</span>
                    <span className="text-white/60 text-sm">vs last month</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="space-y-4">
          <GlassCard variant="premium" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Credit Card</p>
                <p className="text-white/60 text-sm">•••• 4532</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Available Credit</span>
                <span className="text-white font-semibold">BD 8,500$</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Used Credit</span>
                <span className="text-white font-semibold">BD 1,500$</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="premium" className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Export Statement</h3>
              <p className="text-white/60 text-sm mb-4">Download your transaction history</p>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent"
              >
                Download PDF
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Transactions */}
      <GlassCard variant="ultra" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowDownLeft className="h-6 w-6" />
                  ) : (
                    <ArrowUpRight className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-white/60 text-sm">{transaction.category}</p>
                    <Badge className={`${getStatusColor(transaction.status)} border-0 text-xs`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {transaction.type === "income" ? "+" : "-"}BD {transaction.amount.toFixed(2)}$
                </p>
                <p className="text-white/60 text-sm">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
