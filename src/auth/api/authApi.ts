/**
 * API service for authentication-related requests
 */

// Type definitions
export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  last_login?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

// Base URL for all API requests - updated to use the new official domain
const API_URL = 'https://api.lamptomyfeet.co';

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<AuthResponse>} - Response with user data and token
 */
export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
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

  return data;
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<AuthResponse>} - Response with user data and token
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
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

  return data;
};

/**
 * Get user profile
 * @param {string} token - JWT token
 * @returns {Promise<User>} - User profile data
 */
export const getUserProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }

  return data.user;
};

/**
 * Helper function to add authentication header to requests
 * @param {string} token - JWT token
 * @returns {Record<string, string>} - Headers with Authorization
 */
export const authHeader = (token: string): Record<string, string> => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * For future implementation: Reset password request
 * @param {string} email - User's email
 * @returns {Promise<PasswordResetResponse>} - Response
 */
export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  // This is a placeholder for when you implement this endpoint on your backend
  console.log('Password reset requested for email:', email);
  return { success: true, message: 'Password reset instructions sent' };
};