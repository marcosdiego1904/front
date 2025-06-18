/**
 * Configuration values for the application
 */

// API configuration
const API_BASE_URL = "https://api.lamptomyfeet.co";
const DEV_API_URL = "http://localhost:3001";

// Use the appropriate URL based on environment
const isProduction = import.meta.env.PROD;
export const API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

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