/**
 * Utility functions for safe error handling in React components
 */

/**
 * Safely extracts an error message from various error types
 * @param error - The error object (can be Error, string, object, or any)
 * @param fallbackMessage - Default message if no error message can be extracted
 * @returns A safe string message that can be displayed in React components
 */
export function getErrorMessage(error: any, fallbackMessage: string = "An unexpected error occurred"): string {
  // If error is already a string
  if (typeof error === 'string') {
    return error;
  }
  
  // If error has a message property (standard Error object)
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  // If error has a response.data.message (common API error format)
  if (error && error.response && error.response.data && typeof error.response.data.message === 'string') {
    return error.response.data.message;
  }
  
  // If error has a response.data.error (another common API error format)
  if (error && error.response && error.response.data && typeof error.response.data.error === 'string') {
    return error.response.data.error;
  }
  
  // If error has details property
  if (error && typeof error === 'object' && 'details' in error && typeof error.details === 'string') {
    return error.details;
  }
  
  // Try to convert to string (but avoid [object Object])
  if (error && typeof error === 'object') {
    try {
      const stringified = JSON.stringify(error);
      if (stringified !== '{}' && stringified !== '[object Object]') {
        return stringified;
      }
    } catch {
      // JSON.stringify failed, fall back to default
    }
  }
  
  // Return fallback message
  return fallbackMessage;
}

/**
 * Safely logs an error to console with context
 * @param context - Context where the error occurred
 * @param error - The error object
 */
export function logError(context: string, error: any): void {
  console.error(`[${context}]:`, error);
}

/**
 * Creates a safe error handler for React components that use toast notifications
 * @param toast - The toast function from useToast
 * @param context - Context where the error occurred
 */
export function createErrorHandler(toast: any, context: string) {
  return (error: any, customMessage?: string) => {
    const errorMessage = getErrorMessage(error, customMessage || `Failed to ${context.toLowerCase()}`);
    
    logError(context, error);
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
      duration: 5000,
    });
  };
}
