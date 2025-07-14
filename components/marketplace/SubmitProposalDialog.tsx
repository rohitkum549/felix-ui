"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Loader2, DollarSign, FileText, X } from "lucide-react"
import { felixApi } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface SubmitProposalDialogProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceTitle: string
  serviceBudget: number
  userPublicKey: string
}

export function SubmitProposalDialog({ 
  isOpen, 
  onClose, 
  serviceId, 
  serviceTitle, 
  serviceBudget,
  userPublicKey 
}: SubmitProposalDialogProps) {
  const [proposalText, setProposalText] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!proposalText.trim() || !bidAmount.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const bidAmountNumber = parseFloat(bidAmount)
    if (isNaN(bidAmountNumber) || bidAmountNumber <= 0) {
      toast({
        title: "Invalid Bid Amount",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const proposalData = {
        requestId: serviceId,
        providerKey: userPublicKey,
        proposalText: proposalText.trim(),
        bidAmount: bidAmountNumber
      }

      console.log('Submitting proposal with data:', proposalData)
      await felixApi.submitProposal(proposalData)
      
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been successfully submitted!",
        variant: "default",
      })
      
      // Reset form and close dialog
      setProposalText("")
      setBidAmount("")
      onClose()
      
    } catch (error) {
      console.error('Error submitting proposal:', error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setProposalText("")
    setBidAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-400" />
            Submit Proposal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-2">Service Request</h4>
            <p className="text-white/80 text-sm mb-2">{serviceTitle}</p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <DollarSign className="h-4 w-4" />
              <span>Budget: ${serviceBudget}</span>
            </div>
          </div>

          {/* Proposal Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proposalText" className="text-white/80 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal Text
              </Label>
              <Textarea
                id="proposalText"
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                placeholder="Describe your proposal in detail..."
                className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bidAmount" className="text-white/80 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Bid Amount
              </Label>
              <Input
                id="bidAmount"
                type="number"
                step="0.01"
                min="0"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid amount"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
