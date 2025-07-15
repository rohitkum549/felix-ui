"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, DollarSign, FileText, Settings, User, Eye, Send, Loader2, X } from "lucide-react"
import { felixApi } from "@/lib/api-service"
import { SubmitProposalDialog } from "./SubmitProposalDialog"
import { useToast } from "@/components/ui/use-toast"
import { profileService } from "@/lib/profile-service"

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
  status: "pending" | "accepted" | "rejected" | "paid"
  created_at: string
}

interface RequestedServiceCardProps {
  service: RequestedService
  userPublicKey?: string
}

export function RequestedServiceCard({ service, userPublicKey }: RequestedServiceCardProps) {
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const [isSubmitProposalDialogOpen, setIsSubmitProposalDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingProposal, setProcessingProposal] = useState<string | null>(null)
  const { toast } = useToast()
  
  const handleViewProposals = async () => {
    console.log('View Proposals button clicked!')
    setIsProposalDialogOpen(true)
    await fetchProposals()
  }
  
  const handleApplyForService = () => {
    console.log('Apply for service', service.id)
    setIsSubmitProposalDialogOpen(true)
  }
  
  const handleViewDetails = () => {
    console.log('View details', service.id)
    setIsDetailsDialogOpen(true)
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

  const handleAcceptProposal = async (proposalId: string) => {
    setProcessingProposal(proposalId)
    
    try {
      await felixApi.acceptProposal(proposalId)
      
      // Update the proposal status locally
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: 'accepted' as const }
            : proposal
        )
      )
      
      toast({
        title: "Success",
        description: "Proposal accepted successfully",
        variant: "default"
      })
    } catch (err) {
      console.error('Error accepting proposal:', err)
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      })
    } finally {
      setProcessingProposal(null)
    }
  }

  const handleRejectProposal = async (proposalId: string) => {
    setProcessingProposal(proposalId)
    
    try {
      await felixApi.rejectProposal(proposalId)
      
      // Update the proposal status locally
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: 'rejected' as const }
            : proposal
        )
      )
      
      toast({
        title: "Success",
        description: "Proposal rejected successfully",
        variant: "default"
      })
    } catch (err) {
      console.error('Error rejecting proposal:', err)
      toast({
        title: "Error",
        description: "Failed to reject proposal",
        variant: "destructive"
      })
    } finally {
      setProcessingProposal(null)
    }
  }

  const handlePayProposal = async (proposalId: string) => {
    setProcessingProposal(proposalId)
    
    try {
      // Get the client secret from the profile service
      const profile = profileService.getCurrentProfile()
      
      if (!profile || !profile.secret_key) {
        throw new Error('Client secret not available. Please log in again.')
      }
      
      // Call the payment API
      await felixApi.payProposal(proposalId, profile.secret_key)
      
      // Update the proposal status locally
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: 'paid' as const }
            : proposal
        )
      )
      
      toast({
        title: "Success",
        description: "Payment processed successfully",
        variant: "default"
      })
    } catch (err) {
      console.error('Error processing payment:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setProcessingProposal(null)
    }
  }

  const handleDeleteProposal = async (proposalId: string) => {
    setProcessingProposal(proposalId)
    
    try {
      // Call the delete API
      await felixApi.deleteProposal(proposalId)
      
      // Remove the proposal from the list
      setProposals(prevProposals => 
        prevProposals.filter(proposal => proposal.id !== proposalId)
      )
      
      toast({
        title: "Success",
        description: "Proposal deleted successfully",
        variant: "default"
      })
    } catch (err) {
      console.error('Error deleting proposal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete proposal'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setProcessingProposal(null)
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
      case 'paid':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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
            <span className="text-white font-medium">Budget:</span>
            <span className="text-green-400 font-bold">BD {service.budget}$</span>
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
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-white text-xl font-bold">
                      Proposals for "{service.title}"
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsProposalDialogOpen(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
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
                                BD {proposal.bid_amount}$
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
                                  {proposal.status === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-green-400 border-green-400 hover:bg-green-400/10 px-3 py-1"
                                        onClick={() => handleAcceptProposal(proposal.id)}
                                        disabled={processingProposal === proposal.id}
                                      >
                                        {processingProposal === proposal.id ? (
                                          <>
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            Accept
                                          </>
                                        ) : (
                                          'Accept'
                                        )}
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-red-400 border-red-400 hover:bg-red-400/10 px-3 py-1"
                                        onClick={() => handleRejectProposal(proposal.id)}
                                        disabled={processingProposal === proposal.id}
                                      >
                                        {processingProposal === proposal.id ? (
                                          <>
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            Reject
                                          </>
                                        ) : (
                                          'Reject'
                                        )}
                                      </Button>
                                    </>
                                  )}
                                  {proposal.status === 'accepted' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-blue-400 border-blue-400 hover:bg-blue-400/10 px-3 py-1"
                                      onClick={() => handlePayProposal(proposal.id)}
                                      disabled={processingProposal === proposal.id}
                                    >
                                      {processingProposal === proposal.id ? (
                                        <>
                                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          Pay
                                        </>
                                      ) : (
                                        'Pay'
                                      )}
                                    </Button>
                                  )}
                                  {proposal.status === 'paid' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-400 border-red-400 hover:bg-red-400/10 px-3 py-1"
                                      onClick={() => handleDeleteProposal(proposal.id)}
                                      disabled={processingProposal === proposal.id}
                                    >
                                      {processingProposal === proposal.id ? (
                                        <>
                                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          Delete
                                        </>
                                      ) : (
                                        'Delete'
                                      )}
                                    </Button>
                                  )}
                                  {proposal.status === 'rejected' && (
                                    <span className="text-gray-400 text-sm">-</span>
                                  )}
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
            className="px-4 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500 rounded-xl pointer-events-auto cursor-pointer"
            size="sm"
            type="button"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
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
      
      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl font-bold">
                Service Details: "{service.title}"
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailsDialogOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Service Information */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Client Information
                  </h4>
                  <p className="text-white/70 font-mono text-sm">
                    {service.client_key.slice(0, 16)}...{service.client_key.slice(-16)}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    Budget
                  </h4>
                  <p className="text-green-400 font-bold text-lg">BD {service.budget}$</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Badge className="h-4 w-4 mr-2 text-purple-400" />
                    Status
                  </h4>
                  <Badge 
                    className={`${getStatusColor(service.status)} border font-medium`}
                    variant="outline"
                  >
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                    Created
                  </h4>
                  <p className="text-white/70 text-sm">{formatDate(service.created_at)}</p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-400" />
                Description
              </h4>
              <p className="text-white/80 leading-relaxed">{service.description}</p>
            </div>
            
            {/* Requirements */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-purple-400" />
                Requirements
              </h4>
              <p className="text-white/80 leading-relaxed">{service.requirements}</p>
            </div>
            
            {/* Action buttons in details */}
            <div className="flex gap-3 pt-4">
              {!isOwnService && (
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                  onClick={() => {
                    setIsDetailsDialogOpen(false)
                    handleApplyForService()
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Apply for Service
                </Button>
              )}
              {isOwnService && (
                <Button 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl"
                  onClick={() => {
                    setIsDetailsDialogOpen(false)
                    handleViewProposals()
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Proposals
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  )
}
