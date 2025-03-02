/**
 * Main types for authentication and user management
 */

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
    statusCode?: number;
  }
  
  export interface PasswordResetRequestData {
    email: string;
  }
  
  export interface PasswordResetConfirmData {
    token: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface FormErrors {
    [key: string]: string | undefined;
  }
  
  // Route definitions
  export enum Routes {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
    FORGOT_PASSWORD = '/forgot-password',
    RESET_PASSWORD = '/reset-password',
    DASHBOARD = '/dashboard',
    PROFILE = '/profile',
  }
  
  // API endpoints
  export enum ApiEndpoints {
    LOGIN = '/api/auth/login',
    REGISTER = '/api/auth/register',
    PROFILE = '/api/user/profile',
    PASSWORD_RESET = '/api/auth/reset-password',
  }