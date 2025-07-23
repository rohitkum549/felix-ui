"use client"

import { Transaction } from "@/lib/types/dashboard"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, DollarSign, Copy } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  // Determine if transaction amount is positive or negative
  const transactionAmount = parseFloat(transaction.amount.toString())
  const isNegative = transactionAmount < 0
  const isPositive = transactionAmount > 0
  
  // Set colors based on positive/negative values
  const amountColor = isNegative ? "text-red-400" : isPositive ? "text-green-400" : "text-white"
  const iconBgColor = isNegative ? "bg-red-500/20 text-red-400" : isPositive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
  
  const statusColor = transaction.status === "completed" ? "bg-green-500/20 text-green-400 border-green-400/30" : 
                     transaction.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30" :
                     "bg-red-500/20 text-red-400 border-red-400/30"

  return (
    <GlassCard variant="premium" className="p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
            {isNegative ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-white font-semibold">
              {isNegative ? "Sent" : "Received"} {transaction.currency}
            </p>
            <p className="text-white/60 text-sm">
              {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${amountColor}`}>
            {isNegative ? "" : "+"}{Math.abs(transactionAmount).toLocaleString()} {transaction.currency}
          </p>
          <Badge className={statusColor}>
            {transaction.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Transaction ID:</span>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 font-mono text-xs">
              {transaction.id.substring(0, 8)}...{transaction.id.substring(transaction.id.length - 8)}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              className="p-1 h-6 w-6 text-white/60 hover:text-white"
              onClick={() => copyToClipboard(transaction.id, "Transaction ID")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {transaction.stellar_transaction_hash && (
          <div className="flex justify-between items-center">
            <span className="text-white/60">Stellar Hash:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white/80 font-mono text-xs">
                {transaction.stellar_transaction_hash.substring(0, 8)}...{transaction.stellar_transaction_hash.substring(transaction.stellar_transaction_hash.length - 8)}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1 h-6 w-6 text-white/60 hover:text-white"
                onClick={() => copyToClipboard(transaction.stellar_transaction_hash, "Stellar Hash")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
