/**
 * Storage Utilities
 * 
 * Utility functions for safely working with browser storage
 */

/**
 * Check if sessionStorage is available and accessible
 * @returns {boolean} true if sessionStorage is available
 */
export function isSessionStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }

    // Test writing and reading to ensure it's not disabled
    const testKey = '__felix_storage_test__';
    const testValue = 'test';
    
    window.sessionStorage.setItem(testKey, testValue);
    const result = window.sessionStorage.getItem(testKey) === testValue;
    window.sessionStorage.removeItem(testKey);
    
    return result;
  } catch (error) {
    console.warn('SessionStorage is not available:', error);
    return false;
  }
}

/**
 * Check if localStorage is available and accessible
 * @returns {boolean} true if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    // Test writing and reading to ensure it's not disabled
    const testKey = '__felix_storage_test__';
    const testValue = 'test';
    
    window.localStorage.setItem(testKey, testValue);
    const result = window.localStorage.getItem(testKey) === testValue;
    window.localStorage.removeItem(testKey);
    
    return result;
  } catch (error) {
    console.warn('LocalStorage is not available:', error);
    return false;
  }
}

/**
 * Safely get an item from sessionStorage
 * @param key The key to retrieve
 * @returns The value or null if not found/error
 */
export function safeGetSessionStorage(key: string): string | null {
  if (!isSessionStorageAvailable()) {
    return null;
  }

  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting sessionStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safely set an item in sessionStorage
 * @param key The key to set
 * @param value The value to store
 * @returns true if successful, false otherwise
 */
export function safeSetSessionStorage(key: string, value: string): boolean {
  if (!isSessionStorageAvailable()) {
    console.warn('SessionStorage is not available, cannot save data');
    return false;
  }

  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove an item from sessionStorage
 * @param key The key to remove
 * @returns true if successful, false otherwise
 */
export function safeRemoveSessionStorage(key: string): boolean {
  if (!isSessionStorageAvailable()) {
    return false;
  }

  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Get storage usage information
 * @returns Object with storage usage details
 */
export function getStorageInfo() {
  const info = {
    sessionStorage: {
      available: isSessionStorageAvailable(),
      keyCount: 0,
      estimatedSize: 0
    },
    localStorage: {
      available: isLocalStorageAvailable(),
      keyCount: 0,
      estimatedSize: 0
    }
  };

  // Get sessionStorage info
  if (info.sessionStorage.available) {
    try {
      info.sessionStorage.keyCount = sessionStorage.length;
      let size = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          size += key.length + (value?.length || 0);
        }
      }
      info.sessionStorage.estimatedSize = size;
    } catch (error) {
      console.error('Error getting sessionStorage info:', error);
    }
  }

  // Get localStorage info
  if (info.localStorage.available) {
    try {
      info.localStorage.keyCount = localStorage.length;
      let size = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          size += key.length + (value?.length || 0);
        }
      }
      info.localStorage.estimatedSize = size;
    } catch (error) {
      console.error('Error getting localStorage info:', error);
    }
  }

  return info;
}
