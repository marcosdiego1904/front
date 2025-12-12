import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define types
interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  last_login?: string;
  firstName?: string; // Added these properties to match
  lastName?: string;  // what your UserProfile component expects
  bio?: string;
  isPremium?: boolean; // Premium subscription status
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  getUserProfile: () => Promise<User | null>;
  getAuthHeader: () => Record<string, string>;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// API base URL - configurable for development and production
const API_BASE_URL = 'https://api.lamptomyfeet.co';
const DEV_API_URL = 'http://localhost:3001';

// Use the appropriate URL based on environment
const isProduction = import.meta.env.PROD;
const API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

// Create context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      // JWT tokens have 3 parts separated by dots
      const payload = token.split('.')[1];
      if (!payload) return true;

      // Decode base64 payload
      const decodedPayload = JSON.parse(atob(payload));

      // Check if exp claim exists and if token is expired
      if (decodedPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedPayload.exp < currentTime;
      }

      // If no expiration, consider it expired for security
      return true;
    } catch (error) {
      // If we can't decode the token, consider it invalid
      return true;
    }
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      // Validate token before restoring session
      if (isTokenExpired(storedToken)) {
        // Token expired, clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      } else {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }

    setLoading(false);
  }, []);

  // Register a new user
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save user and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Save user and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // Get user profile
  const getUserProfile = async (): Promise<User | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    // Check if token is expired before making request
    if (isTokenExpired(token)) {
      setError('Session expired. Please login again.');
      logout();
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.user;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    if (!token || !user) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }

    // Check if token is expired before making request
    if (isTokenExpired(token)) {
      setError('Session expired. Please login again.');
      logout();
      throw new Error('Session expired. Please login again.');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update the user in state and localStorage
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to get auth header for API requests
  const getAuthHeader = (): Record<string, string> => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getUserProfile,
    getAuthHeader,
    isAuthenticated: !!user && !!token,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};