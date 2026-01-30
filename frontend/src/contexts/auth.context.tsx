import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../config/axios';

export type UserRoleType = 'superadmin' | 'support_admin' | 'developer_admin' | 'expert_panel' | 'client';

export type IUser = {
  id: string;
  email: string;
  role: string;
  name: string;
  accessToken: string;
  assignedSupportDeveloperId: string;
  storeId?: string;
}

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  
  const [user, setUser] = useState<IUser | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token and get user data
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          accessToken: localStorage.getItem('accessToken') || '',
          assignedSupportDeveloperId: userData.assignedSupportDeveloperId || '',
          storeId: userData.storeId || 'default-store'
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser({
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          name: response.data.name,
          accessToken: response.data.accessToken,
          assignedSupportDeveloperId: response.data.assignedSupportDeveloperId || '',
          storeId: response.data.storeId || 'default-store'
        });
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await axios.post('/auth/google', {
        credential
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser({
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          name: response.data.name,
          accessToken: response.data.accessToken,
          assignedSupportDeveloperId: response.data.assignedSupportDeveloperId || '',
          storeId: response.data.storeId || 'default-store'
        });
        toast.success('Google login successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Google login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      await axios.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out successfully!');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    googleLogin,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
