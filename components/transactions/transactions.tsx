"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface TransactionDetail {
  id: string
  type: "income" | "expense" | "transfer"
  amount: number
  description: string
  date: string
  time: string
  status: "completed" | "pending" | "failed"
  category: string
  paymentMethod: string
  reference: string
}

const mockTransactions: TransactionDetail[] = [
  {
    id: "TXN001",
    type: "income",
    amount: 2500.0,
    description: "Freelance Project Payment",
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
    category: "Work",
    paymentMethod: "Bank Transfer",
    reference: "REF123456",
  },
  {
    id: "TXN002",
    type: "expense",
    amount: 89.99,
    description: "Software Subscription",
    date: "2024-01-14",
    time: "09:15",
    status: "completed",
    category: "Tools",
    paymentMethod: "Credit Card",
    reference: "REF123457",
  },
  {
    id: "TXN003",
    type: "transfer",
    amount: 1000.0,
    description: "Transfer to Savings",
    date: "2024-01-13",
    time: "16:45",
    status: "completed",
    category: "Transfer",
    paymentMethod: "Internal",
    reference: "REF123458",
  },
]

export function Transactions() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // const data = await apiService.getTransactionHistory()
      // setTransactions(data)
    } catch (error) {
      console.error("Failed to load transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || transaction.type === selectedType
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft className="h-5 w-5 text-green-400" />
      case "expense":
        return <ArrowUpRight className="h-5 w-5 text-red-400" />
      case "transfer":
        return <ArrowUpRight className="h-5 w-5 text-blue-400" />
      default:
        return <DollarSign className="h-5 w-5 text-gray-400" />
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

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
              <p className="text-white/60 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-400 mt-1">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-400 text-sm font-semibold">+8.2%</span>
            <span className="text-white/60 text-sm ml-2">vs last month</span>
          </div>
        </GlassCard>

        <GlassCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400 mt-1">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-400 text-sm font-semibold">+3.1%</span>
            <span className="text-white/60 text-sm ml-2">vs last month</span>
          </div>
        </GlassCard>

        <GlassCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Net Balance</p>
              <p className="text-2xl font-bold text-white mt-1">${(totalIncome - totalExpense).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-blue-400 text-sm font-semibold">+12.5%</span>
            <span className="text-white/60 text-sm ml-2">vs last month</span>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard variant="premium" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
            />
          </div>

          <div className="flex space-x-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">
                  All Types
                </SelectItem>
                <SelectItem value="income" className="text-white hover:bg-white/10">
                  Income
                </SelectItem>
                <SelectItem value="expense" className="text-white hover:bg-white/10">
                  Expense
                </SelectItem>
                <SelectItem value="transfer" className="text-white hover:bg-white/10">
                  Transfer
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">
                  All Status
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">
                  Completed
                </SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-white/10">
                  Pending
                </SelectItem>
                <SelectItem value="failed" className="text-white hover:bg-white/10">
                  Failed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Transactions List */}
      <GlassCard variant="ultra" className="p-6">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-white font-semibold">{transaction.description}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-white/60 text-sm">{transaction.category}</p>
                    <span className="text-white/40">•</span>
                    <p className="text-white/60 text-sm">{transaction.paymentMethod}</p>
                    <span className="text-white/40">•</span>
                    <p className="text-white/60 text-sm">{transaction.reference}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-white/60 text-sm">{transaction.date}</p>
                  <p className="text-white/60 text-sm">{transaction.time}</p>
                </div>

                <Badge className={`${getStatusColor(transaction.status)} border-0`}>{transaction.status}</Badge>

                <div className="text-right min-w-[120px]">
                  <p
                    className={`text-xl font-bold ${
                      transaction.type === "income"
                        ? "text-green-400"
                        : transaction.type === "expense"
                          ? "text-red-400"
                          : "text-blue-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}$
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
