"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, FileText, Settings, User } from "lucide-react"

export interface RequestedService {
  id: string
  client_key: string
  description: string
  budget: number
  status: "paid" | "open" | "pending" | "completed" | "cancelled"
  created_at: string
  title: string
  requirements: string
}

interface RequestedServiceCardProps {
  service: RequestedService
  userPublicKey?: string
}

export function RequestedServiceCard({ service, userPublicKey }: RequestedServiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const isOwnService = userPublicKey === service.client_key

  return (
    <GlassCard className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 space-y-4">
        {/* Header with title and status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
            <div className="flex items-center text-white/60 text-sm">
              <User className="h-4 w-4 mr-1" />
              <span className="truncate">{service.client_key.slice(0, 8)}...{service.client_key.slice(-8)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge 
              className={`${getStatusColor(service.status)} border font-medium`}
              variant="outline"
            >
              {service.status.toUpperCase()}
            </Badge>
            {isOwnService && (
              <Badge className="bg-emerald-600 text-white font-semibold">
                Your Request
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <FileText className="h-4 w-4 mr-2 text-blue-400" />
            <span className="font-medium">Description</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed pl-6">
            {service.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <Settings className="h-4 w-4 mr-2 text-purple-400" />
            <span className="font-medium">Requirements</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed pl-6">
            {service.requirements}
          </p>
        </div>

        {/* Budget and Date */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-white font-medium">Budget:</span>
            <span className="text-green-400 font-bold">${service.budget}</span>
          </div>
          <div className="flex items-center space-x-1 text-white/60 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(service.created_at)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {!isOwnService && (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
              size="sm"
            >
              Apply for Service
            </Button>
          )}
          <Button 
            variant="outline"
            className="px-4 border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
