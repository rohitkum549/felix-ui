"use client"

import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, User, Mail, Lock, Building, Users, Loader2 } from 'lucide-react';
import { felixApi } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logError } from '@/lib/error-utils';

interface AddUserDialogProps {
  onUserAdded?: (userData: any) => void;
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    role: 'admin',
    password: '',
    entity_belongs_to: 'DevOps',
    entity_manager: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.firstname.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.lastname.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.entity_manager.trim()) {
      toast({
        title: "Validation Error",
        description: "Entity manager is required",
        variant: "destructive",
      });
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API with formData
      const response = await felixApi.createUser(formData);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "User created successfully",
        variant: "default",
      });
      
      // Call the callback if provided
      if (onUserAdded) {
        onUserAdded(response);
      }
      
      // Reset form and close dialog
      setFormData({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        role: 'admin',
        password: '',
        entity_belongs_to: 'DevOps',
        entity_manager: '',
      });
      setIsOpen(false);
    } catch (error: any) {
      logError('Create User', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: getErrorMessage(error, "Failed to create user. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New User
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80 font-medium">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-white/80 font-medium">
                First Name
              </Label>
              <Input
                id="firstname"
                name="firstname"
                placeholder="Enter first name"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-white/80 font-medium">
                Last Name
              </Label>
              <Input
                id="lastname"
                name="lastname"
                placeholder="Enter last name"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80 font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white/80 font-medium">
              Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)} disabled={isLoading}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                <SelectItem value="user" className="text-white hover:bg-white/10">User</SelectItem>
                <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entity_belongs_to" className="text-white/80 font-medium">
              Entity Belongs To
            </Label>
            <Select value={formData.entity_belongs_to} onValueChange={(value) => handleSelectChange('entity_belongs_to', value)} disabled={isLoading}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                <SelectItem value="DevOps" className="text-white hover:bg-white/10">DevOps</SelectItem>
                <SelectItem value="QA" className="text-white hover:bg-white/10">QA</SelectItem>
                <SelectItem value="HR" className="text-white hover:bg-white/10">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entity_manager" className="text-white/80 font-medium">
              Entity Manager
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                id="entity_manager"
                name="entity_manager"
                placeholder="Enter entity manager name"
                value={formData.entity_manager}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 pt-4">
          <Button 
            type="button"
            onClick={() => setIsOpen(false)}
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
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

