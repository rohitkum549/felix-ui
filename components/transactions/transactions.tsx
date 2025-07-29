"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ChevronDown, ChevronRight, Copy, ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { felixApi } from "@/lib/api-service"
import { profileService } from "@/lib/profile-service"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage, logError } from "@/lib/error-utils"

interface TransactionDetail {
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

export function Transactions() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<TransactionDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // Get user profile to get the public_key
      const profile = profileService.getCurrentProfile()
      if (profile && profile.public_key) {
        const data = await felixApi.getTransactionsByUser(profile.public_key)
        console.log("API Response:", data)
        // Handle the response structure
        if (data && typeof data === 'object' && Array.isArray(data.transactions)) {
          console.log("Setting transactions:", data.transactions)
          setTransactions(data.transactions)
        } else if (Array.isArray(data)) {
          setTransactions(data)
        } else {
          console.error("API response format not recognized:", data)
          setTransactions([])
        }
      } else {
        console.error("No public_key found in profile")
        setTransactions([])
      }
    } catch (error) {
      logError("Load Transactions", error)
      toast({
        title: "Error",
        description: getErrorMessage(error, "Failed to load transactions"),
        variant: "destructive",
      })
      setTransactions([])
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} BD`
  }

  const getAmountColor = (amount: number) => {
    if (amount < 0) {
      return "text-red-400"
    } else if (amount > 0) {
      return "text-green-400"
    } else {
      return "text-white"
    }
  }

  const formatAmountWithSign = (amount: number) => {
    const absAmount = Math.abs(amount)
    const sign = amount < 0 ? "-" : "+"
    return `${sign}${absAmount.toFixed(2)} BD`
  }

  const toggleTransaction = (transactionId: string) => {
    setExpandedTransactions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId)
      } else {
        newSet.add(transactionId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  const getTransactionIcon = (amount: number) => {
    return amount < 0 ? ArrowUpRight : ArrowDownRight
  }

  const getTransactionType = (amount: number) => {
    return amount < 0 ? "Sent" : "Received"
  }

  const getIconBgColor = (amount: number) => {
    if (amount < 0) {
      return "bg-red-500/20 text-red-400"
    } else if (amount > 0) {
      return "bg-green-500/20 text-green-400"
    } else {
      return "bg-gray-500/20 text-gray-400"
    }
  }

  const totalAmount = Array.isArray(transactions) ? transactions.reduce((sum, t) => sum + t.amount, 0) : 0

  console.log("Rendering with transactions:", transactions, "isArray:", Array.isArray(transactions), "length:", transactions?.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-white/60">Track and manage all your financial transactions</p>
        </div>

        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{Array.isArray(transactions) ? transactions.length : 0}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{formatAmount(totalAmount)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {Array.isArray(transactions) && transactions.length > 0 
                  ? (transactions.reduce((sum, t) => sum + t.rating, 0) / transactions.length).toFixed(1)
                  : "0.0"
                }
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

{/* Transactions List */}
      <GlassCard variant="ultra" className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white/60">Loading transactions...</div>
          </div>
        ) : !Array.isArray(transactions) || transactions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white/60">No transactions found (Length: {Array.isArray(transactions) ? transactions.length : 'Not Array'})</div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const isExpanded = expandedTransactions.has(transaction.id);
              const TransactionIcon = getTransactionIcon(transaction.amount);
              return (
                <div key={transaction.id} className="border-b border-white/10">
                  <div onClick={() => toggleTransaction(transaction.id)} className="flex justify-between items-center py-4 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor(transaction.amount)}`}>
                        <TransactionIcon className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-white font-semibold">{getTransactionType(transaction.amount)} {transaction.currency}</p>
                        <p className="text-sm text-white/60">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-semibold ${getAmountColor(transaction.amount)}`}>
                        {formatAmountWithSign(transaction.amount)}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-white transition-transform transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="ml-12 mb-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Amount:</span>
                        <span className={`font-semibold ${getAmountColor(transaction.amount)}`}>{formatAmountWithSign(transaction.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Status:</span>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Updated:</span>
                        <span>{formatDate(transaction.updated_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Memo:</span>
                        <span>{transaction.memo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Transaction ID:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-white/80">
                            {transaction.id.substring(0, 8)}...{transaction.id.substring(transaction.id.length - 8)}
                          </span>
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-white/60 hover:text-white" onClick={() => copyToClipboard(transaction.id, "Transaction ID")}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {transaction.stellar_transaction_hash && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Stellar Hash:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-white/80">
                              {transaction.stellar_transaction_hash.substring(0, 8)}...{transaction.stellar_transaction_hash.substring(transaction.stellar_transaction_hash.length - 8)}
                            </span>
                            <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-white/60 hover:text-white" onClick={() => copyToClipboard(transaction.stellar_transaction_hash, "Stellar Hash")}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
