// Example of how to use the type-safe localStorage in your auth context

import { safeLocalStorage, typedLocalStorage } from '../types/local-storage';

// Example 1: Using safeLocalStorage (simple approach)
export const authExample1 = {
  checkAuth: async () => {
    try {
      // ✅ This will work - 'accessToken' is in LocalStorageKey type
      const accessToken = safeLocalStorage.getItem('accessToken');
      
      if (accessToken) {
        // Your auth logic here
        console.log('Token found:', accessToken);
      }
    } catch (error) {
      // ✅ This will work - 'accessToken' is in LocalStorageKey type
      safeLocalStorage.removeItem('accessToken');
      safeLocalStorage.removeItem('user');
    }
  },

  login: async (token: string) => {
    // ✅ This will work - 'accessToken' is in LocalStorageKey type
    safeLocalStorage.setItem('accessToken', token);
  },

  logout: () => {
    // ✅ This will work - 'accessToken' is in LocalStorageKey type
    safeLocalStorage.removeItem('accessToken');
  }
};

// Example 2: Using typedLocalStorage (advanced approach)
export const authExample2 = {
  checkAuth: async () => {
    try {
      // ✅ Type-safe and returns the correct type
      const accessToken = typedLocalStorage.getItem('accessToken');
      
      if (accessToken) {
        console.log('Token found:', accessToken);
      }
    } catch (error) {
      typedLocalStorage.removeItem('accessToken');
      typedLocalStorage.removeItem('user');
    }
  },

  login: async (token: string) => {
    // ✅ Type-safe - value must be string (as defined in LocalStorageData)
    typedLocalStorage.setItem('accessToken', token);
  }
};

// ❌ This will cause TypeScript errors:
// safeLocalStorage.getItem('invalidKey'); // Error: Argument of type '"invalidKey"' is not assignable to parameter of type 'LocalStorageKey'
// safeLocalStorage.setItem('randomKey', 'value'); // Error: Argument of type '"randomKey"' is not assignable to parameter of type 'LocalStorageKey'

// ✅ Valid keys (from your LocalStorageKey type):
// safeLocalStorage.getItem('accessToken'); // ✅
// safeLocalStorage.getItem('user'); // ✅
