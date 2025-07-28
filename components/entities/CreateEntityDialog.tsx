"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Building, Loader2 } from "lucide-react"
import { felixApi } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface CreateEntityDialogProps {
  onEntityCreated?: (entity: any) => void
}

export function CreateEntityDialog({ onEntityCreated }: CreateEntityDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    generate_stellar_keys: true
  })

  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Entity name and code are required fields.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      console.log('Creating entity with data:', formData)
      
      const response = await felixApi.createEntity({
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description.trim() || undefined,
        generate_stellar_keys: formData.generate_stellar_keys
      })

      console.log('Entity created successfully:', response)

      toast({
        title: "Success!",
        description: `Entity "${formData.name}" has been created successfully.`,
        variant: "default",
        duration: 5000,
      })

      // Reset form
      setFormData({
        name: "",
        code: "",
        description: "",
        generate_stellar_keys: true
      })

      // Close dialog
      setIsOpen(false)

      // Call callback if provided
      if (onEntityCreated) {
        onEntityCreated(response)
      }

    } catch (error: any) {
      console.error('Error creating entity:', error)
      
      toast({
        title: "Error",
        description: error.message || "Failed to create entity. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      generate_stellar_keys: true
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Entity
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Building className="h-5 w-5 text-green-400" />
            Create New Entity
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Entity Name */}
          <div className="space-y-2">
            <Label htmlFor="entity-name" className="text-white/80 font-medium">
              Entity Name *
            </Label>
            <Input
              id="entity-name"
              type="text"
              placeholder="Enter entity name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
              required
              disabled={isLoading}
            />
          </div>

          {/* Entity Code */}
          <div className="space-y-2">
            <Label htmlFor="entity-code" className="text-white/80 font-medium">
              Entity Code *
            </Label>
            <Input
              id="entity-code"
              type="text"
              placeholder="Enter entity code (e.g., ENTITY_CODE)"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 font-mono"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="entity-description" className="text-white/80 font-medium">
              Description
            </Label>
            <Textarea
              id="entity-description"
              placeholder="Optional description for the entity"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Generate Stellar Keys */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="space-y-1">
              <Label className="text-white/80 font-medium">
                Generate Stellar Keys
              </Label>
              <p className="text-white/60 text-sm">
                Automatically generate blockchain keys for this entity
              </p>
            </div>
            <Switch
              checked={formData.generate_stellar_keys}
              onCheckedChange={(checked) => handleInputChange("generate_stellar_keys", checked)}
              disabled={isLoading}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

        </div>
        
        <DialogFooter className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-xl disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Building className="h-4 w-4 mr-2" />
                Create Entity
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
