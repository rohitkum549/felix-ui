"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile"
import { getErrorMessage, logError } from "@/lib/error-utils"
import { felixApi } from "@/lib/api-service"
import { PlusCircle, Star, Loader2 } from "lucide-react"

// Star rating component
const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function AddServiceDialog({ onServiceAdded }: { onServiceAdded: () => void }) {
  const { profile } = useProfile()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    memo: "",
    bdAmount: 5,
    assetId: "BD",
    description: "",
    rating: 5
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "bdAmount" ? Number(value) : value
    })
  }

  // Handle star rating change
  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile?.public_key) {
      toast({
        title: "Error",
        description: "User profile not found. Please login again.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const serviceData = {
        creatorKey: profile.public_key,
        memo: formData.memo,
        bdAmount: formData.bdAmount,
        assetId: formData.assetId,
        description: formData.description,
        rating: formData.rating
      };
      
      const data = await felixApi.createService(serviceData)
      
      toast({
        title: "Success",
        description: "Service created successfully!",
      })
      
      // Reset form and close dialog
      setFormData({
        memo: "",
        bdAmount: 5,
        assetId: "BD",
        description: "",
        rating: 5
      })
      
      setOpen(false)
      
      // Refresh the marketplace
      onServiceAdded()
      
    } catch (error) {
      logError('Create Service', error)
      toast({
        title: "Error",
        description: getErrorMessage(error, "Failed to create service"),
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Add New Service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new service to offer in the marketplace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="memo" className="text-white">Service Title</Label>
              <Input
                id="memo"
                name="memo"
                placeholder="Enter service title"
                value={formData.memo}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your service..."
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bdAmount" className="text-white">Price (BD)</Label>
              <Input
                id="bdAmount"
                name="bdAmount"
                type="number"
                min="1"
                step="1"
                value={formData.bdAmount}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assetId" className="text-white">Asset Type</Label>
              <select
                id="assetId"
                name="assetId"
                value={formData.assetId}
                onChange={e => setFormData({...formData, assetId: e.target.value})}
                className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
                disabled // Currently disabled as BD is the only option
              >
                <option value="BD">BD</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-white">Service Rating</Label>
              <StarRating rating={formData.rating} setRating={handleRatingChange} />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
