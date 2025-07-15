"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { felixApi } from "@/lib/api-service"
import { profileService } from "@/lib/profile-service"

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
  const [transactions, setTransactions] = useState<TransactionDetail[]>([])
  const [loading, setLoading] = useState(false)

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
      console.error("Failed to load transactions:", error)
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

      {/* Transactions Table */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/80">Description</TableHead>
                <TableHead className="text-white/80">Amount</TableHead>
                <TableHead className="text-white/80">Status</TableHead>
                <TableHead className="text-white/80">Updated At</TableHead>
                <TableHead className="text-white/80">Memo</TableHead>
                <TableHead className="text-white/80">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{transaction.description}</TableCell>
                  <TableCell className="text-green-400 font-semibold">{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(transaction.status)} border-0`}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">{formatDate(transaction.updated_at)}</TableCell>
                  <TableCell className="text-white/60">{transaction.memo}</TableCell>
                  <TableCell className="text-yellow-400">
                    <div className="flex items-center space-x-1">
                      <span>{transaction.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </GlassCard>
    </div>
  )
}
