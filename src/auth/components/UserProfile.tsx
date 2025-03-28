import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import MemorizedVerses from '../../../pages/learnsection/memorizedVerses';
import './user.css'; // We'll create this new stylesheet

const UserProfile: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };

  if (authLoading || !user) {
    return (
      <div className="user-profile-container">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    } else if (formData.username) {
      return formData.username[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{getInitials()}</div>
        <div className="profile-title">
          <h1>{formData.firstName ? `${formData.firstName} ${formData.lastName}` : formData.username}</h1>
          <p>@{formData.username}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'verses' ? 'active' : ''}`}
          onClick={() => setActiveTab('verses')}
        >
          Memorized Verses
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-tab-content">
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
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
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
                    disabled
                  />
                  <span className="input-note">
                    Username cannot be changed
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                  <span className="input-note">
                    Email address cannot be changed
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Biography</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`save-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="button-spinner"></span>
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-group">
                  <h3>Personal Information</h3>
                  
                  <div className="detail-item">
                    <div className="detail-label">Name</div>
                    <div className="detail-value">
                      {formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : 'Not specified'}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">Username</div>
                    <div className="detail-value">@{formData.username}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{formData.email}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">Member since</div>
                    <div className="detail-value">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">Last login</div>
                    <div className="detail-value">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                </div>
                
                <div className="detail-group">
                  <h3>Biography</h3>
                  <div className="detail-value bio-text">
                    {formData.bio || 'No biography added yet.'}
                  </div>
                </div>
                
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'verses' && (
          <div className="verses-tab-content">
            <MemorizedVerses />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;