import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../context/AuthStyles.css'; // We'll create this shared stylesheet for auth components

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message || 'Login failed. Please try again.');
      } else {
        setServerError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-logo-container">
            {/** */}
          <div className="lamp-icon">
            {/* SVG Lamp Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8,4 C8,2.895 8.895,2 10,2 L14,2 C15.105,2 16,2.895 16,4 L16,5 L8,5 L8,4 Z" fill="#ffc107"/>
              <path d="M9,5 L15,5 L15,10 C15,12.761 12.761,16 10,16 L9,5 Z" fill="#ffc107"/>
              <path d="M10,16 L14,16 C12.5,18.5 11.5,18.5 10,16 Z" fill="#ffc107"/>
              <path d="M11.5,16 L11.5,20" stroke="#ffc107" strokeWidth="2"/>
              <path d="M9,20 L14,20" stroke="#ffc107" strokeWidth="2"/>
              <path d="M8,5 C7,7 7,15 10,16" stroke="#ffc107" strokeWidth="0.5" strokeDasharray="1,1"/>
              <path d="M16,5 C17,7 17,15 14,16" stroke="#ffc107" strokeWidth="0.5" strokeDasharray="1,1"/>
            </svg>
          </div>
          <h1 className="auth-title">Lamp to my feet</h1>
        </div>
        
        <h2 className="auth-subtitle">Sign in to your account</h2>
        
        {serverError && (
          <div className="auth-error-message">
            <span>{serverError}</span>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <i className="icon-email">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </i>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={formErrors.email ? 'input-error' : ''}
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {formErrors.email && (
              <p className="error-text">{formErrors.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="icon-password">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </i>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={formErrors.password ? 'input-error' : ''}
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`auth-button ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;