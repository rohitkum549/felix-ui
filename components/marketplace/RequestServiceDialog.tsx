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
import { felixApi } from "@/lib/api-service"
import { UserPlus, Loader2 } from "lucide-react"

export function RequestServiceDialog({ onServiceRequested }: { onServiceRequested: () => void }) {
  const { profile } = useProfile()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    requirements: "",
    description: "",
    budget: 20
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "budget" ? Number(value) : value
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    console.log('Profile:', profile)
    
    if (!profile?.public_key) {
      console.error('No profile or public key found')
      toast({
        title: "Error",
        description: "User profile not found. Please login again.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const requestData = {
        clientKey: profile.public_key,
        description: formData.description,
        budget: formData.budget,
        title: formData.title,
        requirements: formData.requirements
      };
      
      console.log('Request data:', requestData)
      
      const data = await felixApi.requestService(requestData)
      
      toast({
        title: "Success",
        description: "Service request submitted successfully!",
      })
      
      // Reset form and close dialog
      setFormData({
        title: "",
        requirements: "",
        description: "",
        budget: 20
      })
      
      setOpen(false)
      
      // Refresh the marketplace
      onServiceRequested()
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request service",
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
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Request Service
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Request Service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Submit a request for a service you need.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white">Service Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for your service request..."
                value={formData.title}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="requirements" className="text-white">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Specify your requirements..."
                value={formData.requirements}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">Service Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the service you need..."
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget" className="text-white">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="1"
                step="1"
                value={formData.budget}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
