import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import '../context/AuthStyles.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const validateForm = (): boolean => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Email is invalid');
      return false;
    }
    
    setFormError('');
    return true;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // TODO: This is a placeholder. You'll need to implement the actual password reset functionality on your backend
    // For now, we'll just simulate a successful response after a delay
    setTimeout(() => {
      setSuccessMessage('If an account exists with that email, we\'ve sent password reset instructions.');
      setIsSubmitting(false);
      setEmail('');
    }, 1500);
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-logo-container">
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
        
        <h2 className="auth-subtitle">Forgot your password?</h2>
        
        {successMessage ? (
          <div className="auth-success-message">
            <span>{successMessage}</span>
            <div className="mt-4 text-center">
              <Link to="/login" className="auth-link">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="auth-description">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
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
                    className={formError ? 'input-error' : ''}
                    placeholder="Your email address"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      if (formError) setFormError('');
                    }}
                  />
                </div>
                {formError && (
                  <p className="error-text">{formError}</p>
                )}
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          </>
        )}
        
        <div className="auth-footer">
          <p>Remember your password? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;