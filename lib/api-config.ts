export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
    : '', // Use proxy in development
  STELLAR_ENDPOINT: process.env.NEXT_PUBLIC_STELLAR_ENDPOINT || 'https://horizon.stellar.org',
  TIMEOUT: 10000,
}
