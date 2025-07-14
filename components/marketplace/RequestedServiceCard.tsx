"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, DollarSign, FileText, Settings, User, Eye, Send, Loader2 } from "lucide-react"
import { felixApi } from "@/lib/api-service"
import { SubmitProposalDialog } from "./SubmitProposalDialog"

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

export interface Proposal {
  id: string
  request_id: string
  provider_key: string
  proposal_text: string
  bid_amount: number
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

interface RequestedServiceCardProps {
  service: RequestedService
  userPublicKey?: string
}

export function RequestedServiceCard({ service, userPublicKey }: RequestedServiceCardProps) {
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const [isSubmitProposalDialogOpen, setIsSubmitProposalDialogOpen] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleViewProposals = async () => {
    console.log('View Proposals button clicked!')
    setIsProposalDialogOpen(true)
    await fetchProposals()
  }
  
  const handleApplyForService = () => {
    console.log('Apply for service', service.id)
    setIsSubmitProposalDialogOpen(true)
  }
  
  const fetchProposals = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await felixApi.getProposals(service.id)
      // Handle both single proposal and array of proposals
      const proposalData = Array.isArray(response) ? response : [response]
      setProposals(proposalData)
    } catch (err) {
      console.error('Error fetching proposals:', err)
      setError('Failed to load proposals')
      setProposals([])
    } finally {
      setLoading(false)
    }
  }

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

  const getProposalStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
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
        <div className="flex gap-2 pt-2 relative z-10">
          {isOwnService ? (
            <>
              <Button 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl pointer-events-auto cursor-pointer"
                size="sm"
                type="button"
                onClick={handleViewProposals}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Proposals
              </Button>
              <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
              <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl font-bold">
                    Proposals for "{service.title}"
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {error ? (
                    <div className="text-center py-8 text-red-500">
                      <p>{error}</p>
                    </div>
                  ) : loading ? (
                    <div className="flex items-center justify-center py-8 text-white/60">
                      <Loader2 className="animate-spin h-8 w-8 mr-2" />
                      <span>Loading proposals...</span>
                    </div>
                  ) : proposals.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-white/80 text-sm mb-4">
                        {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-white/80">Provider Key</TableHead>
                            <TableHead className="text-white/80">Proposal Text</TableHead>
                            <TableHead className="text-white/80">Bid Amount</TableHead>
                            <TableHead className="text-white/80">Status</TableHead>
                            <TableHead className="text-white/80">Date</TableHead>
                            <TableHead className="text-white/80">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {proposals.map((proposal) => (
                            <TableRow key={proposal.id} className="border-gray-700 hover:bg-gray-800/50">
                              <TableCell className="text-white/90 font-mono text-sm">
                                {proposal.provider_key.slice(0, 6)}...{proposal.provider_key.slice(-4)}
                              </TableCell>
                              <TableCell className="text-white/80 max-w-xs">
                                <div className="max-w-xs overflow-hidden">
                                  <div className="truncate" title={proposal.proposal_text}>
                                    {proposal.proposal_text}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-green-400 font-semibold">
                                ${proposal.bid_amount}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getProposalStatusColor(proposal.status)} border font-medium`} variant="outline">
                                  {proposal.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white/60 text-sm">
                                {formatDate(proposal.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-green-400 border-green-400 hover:bg-green-400/10 px-3 py-1"
                                    onClick={() => console.log('Accept proposal', proposal.id)}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-400 border-red-400 hover:bg-red-400/10 px-3 py-1"
                                    onClick={() => console.log('Reject proposal', proposal.id)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-white/30" />
                      <p>No proposals received yet.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            </>
          ) : (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl pointer-events-auto cursor-pointer"
              size="sm"
              type="button"
              onClick={handleApplyForService}
            >
              <Send className="h-4 w-4 mr-2" />
              Apply for Service
            </Button>
          )}
          <Button 
            variant="outline"
            className="px-4 border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-xl pointer-events-auto cursor-pointer"
            size="sm"
            type="button"
            onClick={() => console.log('View details', service.id)}
          >
            View Details
          </Button>
        </div>
      </div>
      
      {/* Submit Proposal Dialog */}
      {userPublicKey && (
        <SubmitProposalDialog
          isOpen={isSubmitProposalDialogOpen}
          onClose={() => setIsSubmitProposalDialogOpen(false)}
          serviceId={service.id}
          serviceTitle={service.title}
          serviceBudget={service.budget}
          userPublicKey={userPublicKey}
        />
      )}
    </GlassCard>
  )
}
