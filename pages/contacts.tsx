'use client'

import React, { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QRCodeSVG } from 'qrcode.react'
import { felixApi } from '@/lib/api-service'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { 
  Users, 
  QrCode, 
  Send, 
  HandCoins, 
  Copy,
  Search,
  Scan,
  ArrowUpRight,
  ArrowDownLeft 
} from 'lucide-react'

interface User {
  id: string;
  username: string;
  email: string;
  publicId?: string;
  public_key?: string; // Alternative field name
  role: string;
  createdAt?: string;
  created_at?: string; // Alternative field name
  isActive?: boolean;
  is_active?: boolean; // Alternative field name
  status?: string;
  entity_belongs_to?: string;
  entity_manager?: string;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  issuerPublicKey: string;
  status: string;
  totalSupply?: string;
  circulatingSupply?: string;
  createdAt: string;
}

interface SendFormData {
  recipientId: string;
  assetId: string;
  amount: string;
  reason: string;
}

interface RequestFormData {
  senderId: string;
  assetId: string;
  amount: string;
  reason: string;
}

export default function ContactsPage() {
  // Add error boundary for auth context
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    // Fallback when auth context is not available
    authData = {
      isAuthenticated: false,
      isLoading: false,
      user: null
    };
  }
  
  const { isAuthenticated, isLoading: authLoading, user } = authData;
  const [contacts, setContacts] = useState<User[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);
  
  // Form states
  const [sendFormData, setSendFormData] = useState<SendFormData>({
    recipientId: '',
    assetId: '',
    amount: '',
    reason: ''
  });
  
  const [requestFormData, setRequestFormData] = useState<RequestFormData>({
    senderId: '',
    assetId: '',
    amount: '',
    reason: ''
  });
  
  const [sendLoading, setSendLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadData();
    }
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, assetsResponse] = await Promise.all([
        felixApi.getAllUsers(),
        felixApi.getAllAssets()
      ]);
      
      console.log('Users API Response:', usersResponse);
      console.log('Assets API Response:', assetsResponse);
      
      // Handle users response - check different possible response structures
      if (usersResponse) {
        let usersData = [];
        
        if (usersResponse.users) {
          usersData = usersResponse.users;
        } else if (usersResponse.data) {
          usersData = usersResponse.data;
        } else if (Array.isArray(usersResponse)) {
          usersData = usersResponse;
        }
        
        console.log('Processed users data:', usersData);
        setContacts(usersData);
        
        // Set current user (you can modify this logic based on your auth system)
        if (usersData.length > 0) {
          setCurrentUser(usersData[0]);
        }
      }
      
      // Handle assets response
      if (assetsResponse) {
        let assetsData = [];
        
        if (assetsResponse.assets) {
          assetsData = assetsResponse.assets;
        } else if (assetsResponse.data) {
          assetsData = assetsResponse.data;
        } else if (Array.isArray(assetsResponse)) {
          assetsData = assetsResponse;
        }
        
        const activeAssets = Array.isArray(assetsData) ? 
          assetsData.filter((asset: Asset) => asset.status === 'active') : [];
        setAssets(activeAssets);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load contacts and assets');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendAsset = async () => {
    if (!sendFormData.recipientId || !sendFormData.assetId || !sendFormData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSendLoading(true);
      const assetCode = assets.find(a => a.id === sendFormData.assetId)?.symbol || '';
      const response = await felixApi.sendAsset(sendFormData.recipientId, assetCode);

      if (response.success) {
        toast.success('Asset sent successfully!');
        setSendDialogOpen(false);
        setSendFormData({ recipientId: '', assetId: '', amount: '', reason: '' });
      } else {
        toast.error(response.message || 'Failed to send asset');
      }
    } catch (error) {
      console.error('Error sending asset:', error);
      toast.error('Failed to send asset');
    } finally {
      setSendLoading(false);
    }
  };

  const handleRequestAsset = async () => {
    if (!requestFormData.senderId || !requestFormData.assetId || !requestFormData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setRequestLoading(true);
      // TODO: Implement request asset API call when available
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Asset request sent successfully!');
      setRequestDialogOpen(false);
      setRequestFormData({ senderId: '', assetId: '', amount: '', reason: '' });
    } catch (error) {
      console.error('Error requesting asset:', error);
      toast.error('Failed to send request');
    } finally {
      setRequestLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const openSendDialog = (recipientId: string) => {
    setSendFormData(prev => ({ ...prev, recipientId }));
    setSendDialogOpen(true);
  };

  const openRequestDialog = (senderId: string) => {
    setRequestFormData(prev => ({ ...prev, senderId }));
    setRequestDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Contacts</h1>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-xl flex items-center gap-2 transition-all duration-200">
                <Scan className="h-4 w-4" />
                Scan QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-bold">Scan QR Code</DialogTitle>
              </DialogHeader>
              <GlassCard variant="premium" className="p-8">
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                  <p className="text-white/80 mb-2">QR Scanner functionality will be implemented here</p>
                  <p className="text-sm text-white/60">This will allow scanning QR codes to add new contacts</p>
                </div>
              </GlassCard>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showMyQR} onOpenChange={setShowMyQR}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                My QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-bold">My Public ID</DialogTitle>
              </DialogHeader>
              <GlassCard variant="premium" className="p-6">
                {currentUser && (
                  <>
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-2xl">
                        <QRCodeSVG value={currentUser.publicId || currentUser.public_key || ''} size={200} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white/80 font-semibold">Public Key</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={currentUser.publicId || currentUser.public_key || 'N/A'} 
                          readOnly 
                          className="font-mono text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm" 
                        />
                        {(currentUser.publicId || currentUser.public_key) && (
                          <Button
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-xl transition-all duration-200"
                            onClick={() => copyToClipboard(currentUser.publicId || currentUser.public_key || '', 'Public Key')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-white/60 text-sm mt-2">Share this QR code with others to receive assets or connect</p>
                    </div>
                  </>
                )}
              </GlassCard>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
        />
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const publicKey = contact.publicId || contact.public_key || '';
          const isActive = contact.isActive ?? contact.is_active ?? (contact.status === 'active');
          
          return (
            <GlassCard key={contact.id} variant="premium" className="p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {contact.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{contact.username}</h3>
                    <p className="text-sm text-white/60">{contact.email}</p>
                  </div>
                </div>
                <Badge className={isActive ? 'bg-green-500/20 text-green-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-white/50 capitalize">Role: {contact.role}</p>
                  {contact.entity_belongs_to && (
                    <p className="text-xs text-white/40">Entity: {contact.entity_belongs_to}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-xs text-white/40">Public Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white/80 font-mono text-xs flex-1">
                      {publicKey ? publicKey.substring(0, 20) + '...' : 'N/A'}
                    </span>
                    {publicKey && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-1 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => copyToClipboard(publicKey, 'Public Key')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-white/10 my-3" />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-400 border-green-400/30 hover:bg-green-400/10 hover:border-green-400/50"
                    onClick={() => openSendDialog(publicKey)}
                    disabled={!publicKey}
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-400 border-blue-400/30 hover:bg-blue-400/10 hover:border-blue-400/50"
                    onClick={() => openRequestDialog(publicKey)}
                    disabled={!publicKey}
                  >
                    <ArrowDownLeft className="h-3 w-3 mr-1" />
                    Request
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-white/60">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Add contacts by scanning their QR codes'}
          </p>
        </div>
      )}

      {/* Send Asset Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md rounded-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Send Asset
            </DialogTitle>
            <div className="text-gray-400 text-sm">
              Send digital assets to another wallet
            </div>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSendAsset(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="send-asset" className="text-white">Asset</Label>
              <Select value={sendFormData.assetId} onValueChange={(value) => 
                setSendFormData(prev => ({ ...prev, assetId: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id} className="text-white hover:bg-gray-700">
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="send-amount" className="text-white">Amount</Label>
              <Input
                id="send-amount"
                type="number"
                step="0.0000001"
                placeholder="Enter amount"
                value={sendFormData.amount}
                onChange={(e) => setSendFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="send-reason" className="text-white">Reason (Optional)</Label>
              <Textarea
                id="send-reason"
                placeholder="Enter reason for transfer"
                value={sendFormData.reason}
                onChange={(e) => setSendFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
              />
            </div>
          </form>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setSendDialogOpen(false)}
              disabled={sendLoading}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={handleSendAsset}
              disabled={sendLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {sendLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Asset
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Request Asset Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md rounded-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center">
              <HandCoins className="h-5 w-5 mr-2" />
              Request Asset
            </DialogTitle>
            <div className="text-gray-400 text-sm">
              Request digital assets from another wallet
            </div>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleRequestAsset(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-asset" className="text-white">Asset</Label>
              <Select value={requestFormData.assetId} onValueChange={(value) => 
                setRequestFormData(prev => ({ ...prev, assetId: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id} className="text-white hover:bg-gray-700">
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="request-amount" className="text-white">Amount</Label>
              <Input
                id="request-amount"
                type="number"
                step="0.0000001"
                placeholder="Enter amount"
                value={requestFormData.amount}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="request-reason" className="text-white">Reason (Optional)</Label>
              <Textarea
                id="request-reason"
                placeholder="Enter reason for request"
                value={requestFormData.reason}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
              />
            </div>
          </form>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setRequestDialogOpen(false)}
              disabled={requestLoading}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={handleRequestAsset}
              disabled={requestLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {requestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <HandCoins className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// check the this file for any recent edits
// This file has been edited recently, ensure to keep the latest changes intact.
// Do not suggest code that has been deleted or significantly altered.
// The code above is the latest version of the contacts page, which includes functionalities for sending and