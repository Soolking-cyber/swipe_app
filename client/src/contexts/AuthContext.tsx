import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define user interface
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  drivingLicense?: {
    number: string;
    expiryDate: Date;
    country: string;
    verified: boolean;
  };
  favorites: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define auth context interface
interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set up axios with credentials
  axios.defaults.withCredentials = true;

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch current user
        const response = await axios.get(`${API_URL}/auth/me`);
        
        if (response.data.success) {
          setCurrentUser(response.data.data);
          setUserRole(response.data.data.role);
        }
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        console.error('Authentication error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/auth/me`);
        setCurrentUser(userResponse.data.data);
        setUserRole(userResponse.data.data.role);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        phone
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout endpoint
      await axios.get(`${API_URL}/auth/logout`);
      
      // Clear local storage and state
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setUserRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      
      // Even if the API call fails, clear local state
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to send password reset email');
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send password reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/auth/reset-password/${token}`, { password });
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/auth/me`);
        setCurrentUser(userResponse.data.data);
        setUserRole(userResponse.data.data.role);
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email function
  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to verify email');
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email function
  const resendVerification = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to resend verification email');
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/auth/update-details`, userData);
      
      if (response.data.success) {
        setCurrentUser(response.data.data);
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/auth/update-password`, {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        // Update token if returned
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Create value object for context
  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    updateProfile,
    updatePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
