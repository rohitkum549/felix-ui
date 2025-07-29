"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Factory, Edit, Settings, MoreVertical, Eye, EyeOff, Users, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Entity {
  id: string
  name: string
  code: string
  description?: string
  stellar_public_key: string
  stellar_secret_key: string
  asset_code: string
  created_by: string
  entity_manager_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface EntityCardProps {
  entity: Entity
  onEdit?: (entity: Entity) => void
  onManage?: (entity: Entity) => void
}

export function EntityCard({ entity, onEdit, onManage }: EntityCardProps) {
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)

  const formatKey = (key: string, isVisible: boolean) => {
    if (!key) {
      return "No key available"
    }
    if (isVisible) {
      return key
    }
    if (key.length < 4) {
      return "•".repeat(20) + key
    }
    return "•".repeat(20) + key.slice(-4)
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown"
    }
  }

  return (
    <GlassCard variant="premium" className="p-6 hover:bg-white/5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
            <Factory className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">{entity.name}</h4>
            <p className="text-white/60 text-sm font-mono">{entity.code}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            className={entity.is_active 
              ? "bg-green-500/20 text-green-400 border-0" 
              : "bg-red-500/20 text-red-400 border-0"
            }
          >
            {entity.is_active ? "Active" : "Inactive"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => onEdit?.(entity)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Entity
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => onManage?.(entity)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      {entity.description && (
        <div className="mb-4">
          <p className="text-white/70 text-sm">{entity.description}</p>
        </div>
      )}

      {/* Entity Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Asset Code:</span>
          <span className="text-white font-mono text-sm">{entity.asset_code}</span>
        </div>
        
        {/* Stellar Public Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Stellar Public Key:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPublicKey(!showPublicKey)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1 h-6 w-6"
            >
              {showPublicKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <code className="text-white/80 text-xs font-mono break-all">
              {formatKey(entity.stellar_public_key, showPublicKey)}
            </code>
          </div>
        </div>

        {/* Stellar Secret Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Stellar Secret Key:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1 h-6 w-6"
            >
              {showSecretKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <code className="text-white/80 text-xs font-mono break-all">
              {formatKey(entity.stellar_secret_key, showSecretKey)}
            </code>
          </div>
        </div>
      </div>

      {/* Footer with timestamps */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(entity.created_at)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Updated {formatDate(entity.updated_at)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex-1"
          onClick={() => onEdit?.(entity)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex-1"
          onClick={() => onManage?.(entity)}
        >
          <Settings className="h-3 w-3 mr-1" />
          Manage
        </Button>
      </div>
    </GlassCard>
  )
}
