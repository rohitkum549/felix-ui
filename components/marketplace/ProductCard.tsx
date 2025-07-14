import React, { useState } from 'react';
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { handleBuyNow } from "./buyNowHandler";
import PaymentDialog from "./PaymentDialog";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    sender_id: string;
  };
  secretKey?: string;
  userPublicKey?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, secretKey, userPublicKey }) => {
  const isOwnService = userPublicKey && product.sender_id === userPublicKey;
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const openDialog = () => {
    setIsPaymentDialogOpen(true);
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  const closeDialog = () => {
    setIsPaymentDialogOpen(false);
    // If payment was successful, reload the page after dialog closes
    if (paymentStatus === 'success') {
      window.location.reload();
    }
  };

  const handlePurchase = async () => {
    setPaymentStatus('loading');
    try {
      await handleBuyNow(product.id, secretKey || '', (txHash: string) => {
        setPaymentStatus('success');
        setTransactionHash(txHash);
      });
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Something went wrong during the payment.');
    }
  };

  return (
    <>
      <GlassCard key={product.id} variant="premium" className="group overflow-hidden">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8"
            >
              <Heart className="h-3 w-3" />
            </Button>
          </div>
          {isOwnService && (
            <div className="absolute top-3 left-3">
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">Your Service</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-1">  
            <h3 className="text-white font-semibold line-clamp-1">{product.title}</h3>
          </div>
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-sm">{product.rating}</span>
            </div>
            <p className="text-white font-bold">B$ {product.price}</p>
          </div>

          {/* The Buy Now button with dialog trigger */}
          <div className="relative z-10">
            <Button
              size="sm"
              className={`w-full ${isOwnService 
                ? 'bg-gray-600/50 hover:bg-gray-600/70 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer'} text-white rounded-lg`}
              onClick={!isOwnService ? openDialog : undefined}
              disabled={isOwnService}
              title={isOwnService ? "You cannot buy your own service" : ""}
            >
              <ShoppingCart className="h-3 w-3 mr-2" />
              {isOwnService ? "Owned" : "Buy Now"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Payment Dialog */}
<PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={closeDialog}
        status={paymentStatus}
        errorMessage={errorMessage}
        onConfirm={handlePurchase}
        productName={product.title}
        productPrice={product.price}
        transactionHash={transactionHash}
      />
    </>
  );
};
