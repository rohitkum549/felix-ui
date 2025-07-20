"use client"

import { Service } from "@/lib/types/dashboard"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Copy, DollarSign } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  const statusColor = service.status === "completed" ? "bg-green-500/20 text-green-400 border-green-400/30" : 
                     service.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30" :
                     "bg-red-500/20 text-red-400 border-red-400/30"

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        }`}
      />
    ))
  }

  return (
    <GlassCard variant="premium" className="p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-lg">
              {service.description || service.memo}
            </p>
            <p className="text-white/60 text-sm">
              {formatDistanceToNow(new Date(service.created_at), { addSuffix: true })}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                {renderStars(service.rating)}
              </div>
              <span className="text-white/60 text-sm">({service.rating}/5)</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-white font-bold text-lg">
              {service.amount} {service.currency}
            </span>
          </div>
          <Badge className={statusColor}>
            {service.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Service ID:</span>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 font-mono text-xs">
              {service.id.substring(0, 8)}...{service.id.substring(service.id.length - 8)}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              className="p-1 h-6 w-6 text-white/60 hover:text-white"
              onClick={() => copyToClipboard(service.id, "Service ID")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/60">Price:</span>
          <span className="text-white font-semibold">{service.price} {service.currency}</span>
        </div>
        
        {service.stellar_transaction_hash && (
          <div className="flex justify-between items-center">
            <span className="text-white/60">Stellar Hash:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white/80 font-mono text-xs">
                {service.stellar_transaction_hash.substring(0, 8)}...{service.stellar_transaction_hash.substring(service.stellar_transaction_hash.length - 8)}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1 h-6 w-6 text-white/60 hover:text-white"
                onClick={() => copyToClipboard(service.stellar_transaction_hash, "Stellar Hash")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {service.memo && (
          <div className="mt-3 p-3 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm">{service.memo}</p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
