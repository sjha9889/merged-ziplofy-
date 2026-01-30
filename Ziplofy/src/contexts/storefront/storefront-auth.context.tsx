import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { axiosi } from '../../config/axios.config';
import { safeLocalStorage } from '../../types/local-storage';
import {toast} from 'react-hot-toast'

export interface StorefrontUser {
  _id: string;
  storeId: string;
  firstName: string;
  lastName: string;
  language: string;
  email: string;
  phoneNumber?: string;
  isVerified: boolean;
  agreedToMarketingEmails: boolean;
  agreedToSmsMarketing: boolean;
  collectTax: 'collect' | 'dont_collect' | 'collect_unless_exempt';
  tagIds: any[];
  createdAt: string;
  updatedAt: string;
  defaultAddress?: string;
}

interface SignupPayload {
  storeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  data: StorefrontUser;
  token: string;
}

interface LoginPayload {
  storeId: string;
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: StorefrontUser;
  token: string;
}

interface ForgotPasswordPayload {
  email: string;
  storeId: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  storeId: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  language?: string;
  phoneNumber?: string;
  password?: string;
  isVerified?: boolean;
  agreedToMarketingEmails?: boolean;
  agreedToSmsMarketing?: boolean;
  collectTax?: 'collect' | 'dont_collect' | 'collect_unless_exempt';
  notes?: string;
  tagIds?: string[];
  defaultAddress?: string;
}

interface StorefrontAuthContextType {
  user: StorefrontUser | null;
  loading: boolean;
  error: string | null;
  signup: (payload: SignupPayload) => Promise<StorefrontUser>;
  login: (payload: LoginPayload) => Promise<StorefrontUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<StorefrontUser | null>;
  setUser: (u: StorefrontUser | null) => void;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  updateUser: (customerId: string, payload: UpdateUserPayload) => Promise<void>;
}

const StorefrontAuthContext = createContext<StorefrontAuthContextType | undefined>(undefined);

export const StorefrontAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StorefrontUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract token from URL parameters on app load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    
    if (accessToken) {
      console.log('Token found in URL for storefront, setting in localStorage');
      safeLocalStorage.setItem("accessToken", accessToken);
      
      // Clean up URL by removing the token parameter
      params.delete("accessToken");
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);
  const signup = useCallback(async (payload: SignupPayload): Promise<StorefrontUser> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<SignupResponse>('/storefront/auth/signup', payload);
      if (!res.data.success) throw new Error('Signup failed');
      setUser(res.data.data);
      safeLocalStorage.setItem('accessToken', res.data.token);
      toast.success(`Welcome, ${res.data.data.firstName}! Account created successfully.`);
      return res.data.data;
    } catch (err: any) {
      let errorMessage = 'Signup failed';
      
      if (err?.response?.status === 409) {
        errorMessage = 'User with this email already exists';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid signup data';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<StorefrontUser> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<LoginResponse>('/storefront/auth/login', payload);
      if (!res.data.success) throw new Error('Login failed');
      setUser(res.data.data);
      safeLocalStorage.setItem('accessToken', res.data.token);
      toast.success(`Welcome back, ${res.data.data.firstName}!`);
      
      return res.data.data;
    } catch (err: any) {
      let errorMessage = 'Login failed';
      
      if (err?.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'User not found. Please check your email.';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid login data';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    safeLocalStorage.removeItem('accessToken');
    setUser(null);
    toast.success('Logged out');
  }, []);

  const checkAuth = useCallback(async (): Promise<StorefrontUser | null> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<{ success: boolean; data: StorefrontUser }>('/storefront/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        toast.success(`Welcome back, ${res.data.data.firstName}!`);
        return res.data.data;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      // Don't show error toast for failed auth check as it's expected for non-logged in users
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<ForgotPasswordResponse>('/storefront/auth/forgot-password', payload);
      if (!res.data.success) throw new Error('Forgot password failed');
      toast.success('Password reset link sent to your email! Check your inbox.');
    } catch (err: any) {
      let errorMessage = 'Failed to send reset email';
      
      if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid email address';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (payload: ResetPasswordPayload): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<ResetPasswordResponse>('/storefront/auth/reset-password', payload);
      if (!res.data.success) throw new Error('Reset password failed');
      toast.success('Password reset successfully! You can now login with your new password.');
    } catch (err: any) {
      let errorMessage = 'Failed to reset password';
      
      if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid token or password';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (customerId: string, payload: UpdateUserPayload): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.patch<{ success: boolean; data: StorefrontUser }>(`/storefront/customer/${customerId}`, payload);
      if (!res.data.success) throw new Error('Update failed');
      
      // Update the user state with the new data
      setUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      let errorMessage = 'Failed to update profile';
      
      if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid update data';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Customer not found';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: StorefrontAuthContextType = { 
    user, 
    loading, 
    error, 
    signup, 
    login, 
    logout, 
    checkAuth, 
    setUser, 
    forgotPassword, 
    resetPassword,
    updateUser
  };

  return (
    <StorefrontAuthContext.Provider value={value}>{children}</StorefrontAuthContext.Provider>
  );
};

export const useStorefrontAuth = (): StorefrontAuthContextType => {
  const ctx = useContext(StorefrontAuthContext);
  if (!ctx) throw new Error('useStorefrontAuth must be used within a StorefrontAuthProvider');
  return ctx;
};

export default StorefrontAuthContext;


