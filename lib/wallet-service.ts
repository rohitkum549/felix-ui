/**
 * Wallet Service
 * 
 * Utility functions for wallet-related operations
 */

/**
 * Get the user's secret key from session storage
 * 
 * This function follows secure practices:
 * 1. Only retrieves from session storage (more secure than localStorage)
 * 2. Provides a fallback for development/testing environments
 * 3. Never exposes the secret in logs
 * 
 * @returns {string} The user's secret key
 */
export function getUserSecret(): string {
  // For production, you should ONLY use this from session storage
  const userSecret = sessionStorage.getItem('userSecret')
  
  // Fallback for development or testing (this should be removed in production)
  if (!userSecret && process.env.NODE_ENV === 'development') {
    // This is only for development testing
    return 'SCLCQUPTQA35H2G5GV2DOIWVLSMWQ3LQYAGUCU7OOENLCOIRQQTL3WRX'
  }
  
  return userSecret || ''
}

/**
 * Safely store the user's secret key in session storage
 * 
 * @param {string} secret - The user's secret key to store
 */
export function storeUserSecret(secret: string): void {
  if (!secret) {
    console.error('Attempted to store empty user secret')
    return
  }
  
  try {
    sessionStorage.setItem('userSecret', secret)
  } catch (error) {
    console.error('Failed to store user secret in session storage')
  }
}

/**
 * Clear the user's secret key from session storage
 */
export function clearUserSecret(): void {
  try {
    sessionStorage.removeItem('userSecret')
  } catch (error) {
    console.error('Failed to clear user secret from session storage')
  }
}

/**
 * Format a wallet balance with proper decimal places
 * 
 * @param {string} balance - The raw balance string from the API
 * @param {number} decimalPlaces - Number of decimal places to display
 * @returns {string} The formatted balance string
 */
export function formatBalance(balance: string, decimalPlaces: number = 2): string {
  if (!balance) return '0.00'
  
  try {
    return parseFloat(balance).toLocaleString('en-US', { 
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    })
  } catch (error) {
    console.error('Failed to format balance', error)
    return '0.00'
  }
}
