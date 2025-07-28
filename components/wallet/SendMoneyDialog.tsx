"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { profileService } from "@/lib/profile-service"
import { felixApi } from "@/lib/api-service"

interface SendMoneyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}
interface SendMoneyRequest {
  senderSecret: string
  receiverPublic: string
  amount: string
}

type DialogStatus = "idle" | "loading" | "success" | "error"

export function SendMoneyDialog({ isOpen, onClose, onSuccess }: SendMoneyDialogProps) {
  const [receiverPublic, setReceiverPublic] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState<DialogStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [transactionHash, setTransactionHash] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!receiverPublic.trim() || !amount.trim()) {
      setErrorMessage("Please fill in all fields")
      setStatus("error")
      return
    }

    const amountNumber = parseFloat(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setErrorMessage("Please enter a valid amount")
      setStatus("error")
      return
    }

    try {
      setStatus("loading")
      setErrorMessage("")

      // Get sender secret from session
      const profileData = profileService.getProfileFromSession()
      if (!profileData || !profileData.secret_key) {
        throw new Error("User profile or secret key not found")
      }

      const sendRequest: SendMoneyRequest = {
        senderSecret: profileData.secret_key,
        receiverPublic: receiverPublic.trim(),
        amount: amount.trim()
      }

      // Make the API call
      const response = await felixApi.sendMoney(sendRequest)
      
      // Handle successful response
      if (response) {
        // Extract transaction hash from response (adjust based on actual API response structure)
        const transactionHash = response.transactionHash || response.hash || response.id || ""
        setTransactionHash(transactionHash)
        setStatus("success")
        
        // Call onSuccess callback to refresh wallet data
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error("Failed to send money")
      }
    } catch (error) {
      console.error("Send money error:", error)
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while sending money")
      setStatus("error")
    }
  }

  const handleClose = () => {
    setReceiverPublic("")
    setAmount("")
    setStatus("idle")
    setErrorMessage("")
    setTransactionHash("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md rounded-lg overflow-hidden">
        <DialogHeader>
          {status === "idle" && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Send Money
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Send BD (Blue Dollar) to another wallet
              </DialogDescription>
            </>
          )}
          {status === "loading" && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Transaction
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Please wait while we process your transaction...
              </DialogDescription>
            </>
          )}
          {status === "success" && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                Transaction Successful
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Your money has been sent successfully!
              </DialogDescription>
            </>
          )}
          {status === "error" && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                Transaction Failed
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {errorMessage}
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiverPublic" className="text-white">
                Receiver Public Key
              </Label>
              <Input
                id="receiverPublic"
                type="text"
                value={receiverPublic}
                onChange={(e) => setReceiverPublic(e.target.value)}
                placeholder="Enter receiver's public key"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">
                Amount (BD)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to send"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
            </div>
          </form>
        )}

        {status === "loading" && (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {status === "success" && (
          <div className="py-4">
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Amount Sent:</span>
                <span className="font-bold text-green-400">BD {amount}</span>
              </div>
              <div className="mt-2">
                <span className="text-white">To:</span>
                <p className="text-xs text-gray-400 break-all font-mono mt-1">
                  {receiverPublic}
                </p>
              </div>
              {transactionHash && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Transaction ID:</span>
                  <p className="text-xs text-green-400 break-all font-mono mt-1">
                    {transactionHash}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-4">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-4 text-red-400">
              <p>Please check your inputs and try again, or contact support if the issue persists.</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {status === "idle" && (
            <>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Money
              </Button>
            </>
          )}
          {status === "loading" && (
            <Button disabled className="bg-gray-700 text-gray-300 cursor-not-allowed">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </Button>
          )}
          {(status === "success" || status === "error") && (
            <Button 
              onClick={handleClose}
              className={status === "success" 
                ? "bg-gradient-to-r from-green-500 to-green-600" 
                : "bg-gradient-to-r from-gray-500 to-gray-600"}
            >
              {status === "success" ? "Done" : "Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
