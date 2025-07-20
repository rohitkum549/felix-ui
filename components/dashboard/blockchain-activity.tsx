"use client"

import { Transaction, Service } from "@/lib/types/dashboard"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Shield, Blocks, Copy } from "lucide-react"
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface BlockchainActivityProps {
  transactions: Transaction[]
  services: Service[]
}

interface ActivityItem {
  id: string
  action: string
  entity: string
  time: string
  type: 'transaction' | 'service' | 'security' | 'transfer'
  hash: string
  amount?: number
  currency?: string
  created_at: string
}

export function BlockchainActivity({ transactions, services }: BlockchainActivityProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  // Combine and format activities
  const activities: ActivityItem[] = [
    ...transactions.map(tx => ({
      id: tx.id,
      action: `BlueDollar transfer ${tx.status}`,
      entity: `${tx.amount} ${tx.currency}`,
      time: formatDistanceToNow(parseISO(tx.created_at), { addSuffix: true }),
      type: 'transfer' as const,
      hash: tx.stellar_transaction_hash || tx.id,
      amount: tx.amount,
      currency: tx.currency,
      created_at: tx.created_at
    })),
    ...services.map(service => ({
      id: service.id,
      action: `Service ${service.status}`,
      entity: service.description || service.memo,
      time: formatDistanceToNow(parseISO(service.created_at), { addSuffix: true }),
      type: 'service' as const,
      hash: service.stellar_transaction_hash || service.id,
      amount: service.amount,
      currency: service.currency,
      created_at: service.created_at
    }))
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-6 w-6" />
      case 'transfer':
        return <ArrowUpRight className="h-6 w-6" />
      case 'service':
        return <ShoppingCart className="h-6 w-6" />
      default:
        return <Blocks className="h-6 w-6" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'security':
        return "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-400/30"
      case 'transfer':
        return "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30"
      case 'service':
        return "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-400/30"
      default:
        return "bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-400/30"
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Blocks className="h-8 w-8 text-white/40" />
        </div>
        <p className="text-white/60">No recent blockchain activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${getActivityColor(activity.type)}`}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-lg">{activity.action}</p>
            <p className="text-white/70 text-sm mt-1">{activity.entity}</p>
            {activity.amount && (
              <p className="text-green-400 text-sm font-medium mt-1">
                {activity.amount} {activity.currency}
              </p>
            )}
            <p className="text-white/50 text-xs mt-1 font-mono flex items-center">
              Hash: {activity.hash.substring(0, 8)}...{activity.hash.substring(activity.hash.length - 8)}
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1 h-6 w-6 text-white/40 hover:text-white ml-2"
                onClick={() => copyToClipboard(activity.hash, "Hash")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-sm">{activity.time}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-semibold">Confirmed</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
