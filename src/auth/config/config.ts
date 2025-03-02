/**
 * Configuration values for the application
 */

// API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';

// Authentication settings
export const AUTH_TOKEN_KEY = 'token';
export const USER_DATA_KEY = 'user';
export const TOKEN_EXPIRY_DAYS = 7;

// Validation rules
export const PASSWORD_MIN_LENGTH = 6;
export const USERNAME_MIN_LENGTH = 3;

// Timeouts and intervals (in milliseconds)
export const API_TIMEOUT = 10000; // 10 seconds
export const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 15; // 15 minutes

// Feature flags
export const FEATURES = {
  ENABLE_REMEMBER_ME: true,
  ENABLE_PASSWORD_RESET: true,
  ENABLE_SOCIAL_LOGIN: false,
};