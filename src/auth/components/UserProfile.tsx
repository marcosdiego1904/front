import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardStyles.css';

export interface User {
    id?: string;
    email?: string;
    // Add these properties:
    firstName?: string;
    lastName?: string;
    bio?: string;
    // Any other properties you have
  }

const UserProfile: React.FC<User> = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      // Call your updateUserProfile function from Auth context
      // This is a placeholder, implementation depends on your backend
      if (updateUserProfile) {
        await updateUserProfile(formData);
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Update profile function not available");
      }
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelEdit = () => {
    // Reset form data to original user data
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
    setErrorMessage("");
  };
  
  return (
    <div className="dashboard-container">
      {/* Sidebar would be included in a layout component */}
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>User Profile</h1>
          <div className="user-profile">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>
        </header>
        
        <div className="profile-content">
          {successMessage && (
            <div className="auth-success-message">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="auth-error-message">
              {errorMessage}
            </div>
          )}
          
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {formData.firstName?.charAt(0) || formData.username?.charAt(0) || 'U'}
              </div>
              <div className="profile-info">
                <h2>{formData.firstName} {formData.lastName}</h2>
                <p className="username">@{formData.username}</p>
                {!isEditing && (
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled // Email is typically not changed directly
                  />
                  <span className="input-note">Contact support to change your email address</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`save-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-group">
                  <h3>Profile Information</h3>
                  
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">
                      {formData.firstName && formData.lastName 
                        ? `${formData.firstName} ${formData.lastName}` 
                        : 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Username</span>
                    <span className="detail-value">@{formData.username}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{formData.email}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Bio</span>
                    <p className="detail-value bio-text">
                      {formData.bio || 'No bio provided yet.'}
                    </p>
                  </div>
                </div>
                
                <div className="detail-group">
                  <h3>Account Security</h3>
                  
                  <div className="detail-item">
                    <span className="detail-label">Password</span>
                    <span className="detail-value">
                      ********
                      <button className="link-button">Change password</button>
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Account Created</span>
                    <span className="detail-value">January 15, 2023</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;