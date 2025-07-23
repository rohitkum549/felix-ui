'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                Scan QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">QR Scanner functionality will be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">This will allow scanning QR codes to add new contacts</p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showMyQR} onOpenChange={setShowMyQR}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                My QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>My Public ID</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {currentUser && (
                  <>
                    <div className="flex justify-center">
                      <QRCodeSVG value={currentUser.publicId || currentUser.public_key || ''} size={200} />
                    </div>
                    <div className="space-y-2">
                      <Label>Public Key</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={currentUser.publicId || currentUser.public_key || 'N/A'} 
                          readOnly 
                          className="font-mono text-sm" 
                        />
                        {(currentUser.publicId || currentUser.public_key) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(currentUser.publicId || currentUser.public_key || '', 'Public Key')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const publicKey = contact.publicId || contact.public_key || '';
          const isActive = contact.isActive ?? contact.is_active ?? (contact.status === 'active');
          
          return (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{contact.username}</CardTitle>
                  <Badge variant={isActive ? 'default' : 'secondary'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{contact.email}</p>
                <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                {contact.entity_belongs_to && (
                  <p className="text-xs text-gray-400">Entity: {contact.entity_belongs_to}</p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Public Key</Label>
                  <div className="flex gap-1 mt-1">
                    <Input
                      value={publicKey ? publicKey.substring(0, 20) + '...' : 'N/A'}
                      readOnly
                      className="font-mono text-xs h-8"
                    />
                    {publicKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => copyToClipboard(publicKey, 'Public Key')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => openSendDialog(publicKey)}
                    disabled={!publicKey}
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => openRequestDialog(publicKey)}
                    disabled={!publicKey}
                  >
                    <ArrowDownLeft className="h-3 w-3 mr-1" />
                    Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Add contacts by scanning their QR codes'}
          </p>
        </div>
      )}

      {/* Send Asset Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-600" />
              Send Asset
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="send-asset">Asset</Label>
              <Select value={sendFormData.assetId} onValueChange={(value) => 
                setSendFormData(prev => ({ ...prev, assetId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="send-amount">Amount</Label>
              <Input
                id="send-amount"
                type="number"
                step="0.0000001"
                placeholder="Enter amount"
                value={sendFormData.amount}
                onChange={(e) => setSendFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="send-reason">Reason (Optional)</Label>
              <Textarea
                id="send-reason"
                placeholder="Enter reason for transfer"
                value={sendFormData.reason}
                onChange={(e) => setSendFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setSendDialogOpen(false)}
                disabled={sendLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSendAsset}
                disabled={sendLoading}
              >
                {sendLoading ? 'Sending...' : 'Send Asset'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Asset Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-blue-600" />
              Request Asset
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="request-asset">Asset</Label>
              <Select value={requestFormData.assetId} onValueChange={(value) => 
                setRequestFormData(prev => ({ ...prev, assetId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="request-amount">Amount</Label>
              <Input
                id="request-amount"
                type="number"
                step="0.0000001"
                placeholder="Enter amount"
                value={requestFormData.amount}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="request-reason">Reason (Optional)</Label>
              <Textarea
                id="request-reason"
                placeholder="Enter reason for request"
                value={requestFormData.reason}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setRequestDialogOpen(false)}
                disabled={requestLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleRequestAsset}
                disabled={requestLoading}
              >
                {requestLoading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
