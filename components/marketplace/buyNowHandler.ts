import { felixApi } from "@/lib/api-service";
import { toast } from "@/hooks/use-toast";

export const handleBuyNow = async (memoId: string, buyerSecret: string, onSuccessCallback?: () => void) => {
  try {
    if (!buyerSecret) {
      throw new Error('User credentials not found');
    }
    
    const response = await felixApi.payForMemo(memoId, buyerSecret);
    toast({
      title: 'Payment Successful',
      description: 'The payment was processed successfully!'
    });
    
    if(onSuccessCallback) onSuccessCallback(response?.txHash);
    return response;
  } catch (error: any) {
    toast({
      title: 'Payment Failed',
      description: error?.message || 'An error occurred while processing the payment.'
    });
    throw error;
  }
};
