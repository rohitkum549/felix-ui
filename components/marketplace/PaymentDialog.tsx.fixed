import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  onConfirm: () => void;
  productName: string;
  productPrice: number;
  transactionHash?: string;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  status,
  errorMessage,
  onConfirm,
  productName,
  productPrice,
  transactionHash = '',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white">
        <DialogHeader>
          {status === 'idle' && (
            <>
              <DialogTitle className="text-lg font-bold">Confirm Purchase</DialogTitle>
              <DialogDescription className="text-gray-400">
                You are about to purchase the following item:
              </DialogDescription>
            </>
          )}
          {status === 'loading' && (
            <>
              <DialogTitle className="text-lg font-bold">Processing Payment</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please wait while we process your payment...
              </DialogDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" /> 
                Payment Successful
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Your purchase has been completed successfully!
              </DialogDescription>
            </>
          )}
          {status === 'error' && (
            <>
              <DialogTitle className="text-lg font-bold flex items-center text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" /> 
                Payment Failed
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {errorMessage || 'An error occurred while processing your payment.'}
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {status === 'idle' && (
          <div className="py-4">
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{productName}</h3>
                <p className="font-bold">B$ {productPrice}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              By confirming this purchase, you agree to the terms and conditions.
            </p>
          </div>
        )}

        {status === 'loading' && (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{productName}</h3>
                <p className="font-bold">B$ {productPrice}</p>
              </div>
              {transactionHash && (
                <p className="text-sm text-green-400 mt-2">
                  Transaction ID: {transactionHash}
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-4 text-red-400">
              <p>
                Please try again later or contact support if the issue persists.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {status === 'idle' && (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={onConfirm}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Confirm Purchase
              </Button>
            </>
          )}
          {status === 'loading' && (
            <Button disabled className="bg-gray-700 text-gray-300 cursor-not-allowed">
              Processing...
            </Button>
          )}
          {(status === 'success' || status === 'error') && (
            <Button 
              onClick={onClose}
              className={status === 'success' 
                ? "bg-gradient-to-r from-green-500 to-green-600" 
                : "bg-gradient-to-r from-gray-500 to-gray-600"}
            >
              {status === 'success' ? 'Done' : 'Close'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
