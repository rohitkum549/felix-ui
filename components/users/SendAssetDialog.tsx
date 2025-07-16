import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Key, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { felixApi } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';

interface SendAssetDialogProps {
  publicKey: string;
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  username: string;
}

export function SendAssetDialog({
  publicKey,
  onClose,
  isOpen,
  onSuccess,
  username,
}: SendAssetDialogProps) {
  const [assetCode, setAssetCode] = useState('BD');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAssetChange = (value: string) => {
    setAssetCode(value);
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Sending asset to user with public key:', publicKey, 'asset code:', assetCode);
      
      // Show loading toast
      toast({
        title: "Asset Transfer",
        description: `Sending ${assetCode} to ${username}...`,
        duration: 5000, // 5 seconds
      });
      
      // Call the API to send asset
      const response = await felixApi.sendAsset(publicKey, assetCode);
      
      // Show success toast
      toast({
        title: "Success!",
        description: `${assetCode} sent successfully to ${username}`,
        variant: "default",
        duration: 5000, // 5 seconds
      });
      
      console.log('Asset sent successfully:', response);
      
      // Call success callback
      onSuccess();
      
      // Close dialog
      onClose();
      
    } catch (error: any) {
      console.error('Error sending asset:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to send asset. Please try again.",
        variant: "destructive",
        duration: 5000, // 5 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Key className="h-5 w-5" />
            Send Asset
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="publicKey" className="text-white/80 font-medium">
              Public Key
            </Label>
            <Input
              id="publicKey"
              value={publicKey}
              readOnly
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
            />
            <p className="text-white/60 text-xs mt-1">
              This is the user's public key for receiving assets.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetCode" className="text-white/80 font-medium">
              Asset Code
            </Label>
            <Select value={assetCode} onValueChange={handleAssetChange} disabled={isLoading}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30 disabled:opacity-50">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                {['BD', 'BTC', 'ETH', 'XRP', 'USDT'].map((code) => (
                  <SelectItem value={code} key={code} className="text-white hover:bg-white/10">
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-white/20 text-white hover:bg-white/10 rounded-xl disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
