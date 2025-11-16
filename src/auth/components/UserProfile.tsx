import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit2, Save, X, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Profile.css';
import { calculateUserRank } from '../../utils/RankingSystem';

interface MemorizedVerse {
  id: number;
  verse_reference: string;
  memorized_date: string;
}

const UserProfile = () => {
  const { user, updateUserProfile, logout, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [memorizedVerses, setMemorizedVerses] = useState<MemorizedVerse[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: ''
  });

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

    // Fetch memorized verses for stats
    const fetchVerses = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/memorized-verses`,
          { headers: getAuthHeader() }
        );

        let processedVerses: MemorizedVerse[] = [];
        if (response.data?.verses && Array.isArray(response.data.verses)) {
          processedVerses = response.data.verses;
        } else if (Array.isArray(response.data)) {
          processedVerses = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          processedVerses = response.data.data;
        }

        setMemorizedVerses(processedVerses);
      } catch (error) {
        console.error('Error fetching verses:', error);
      }
    };

    fetchVerses();
  }, [user, getAuthHeader]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
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

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    } else if (formData.username) {
      return formData.username[0].toUpperCase();
    }
    return 'U';
  };

  const getMemberSince = () => {
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
    return 'Unknown';
  };

  const versesCount = memorizedVerses.length;
  const rankInfo = calculateUserRank(versesCount);

  return (
    <div className="profile-page">
      <div className="profile-container-new">

        {/* Profile Header */}
        <section className="profile-hero">
          <div className="profile-avatar-large">
            {getInitials()}
          </div>
          <h1 className="profile-username">
            {formData.firstName && formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : formData.username}
          </h1>
          <p className="profile-subtitle">@{formData.username}</p>
          <p className="profile-member-since">
            Member since {getMemberSince()}
          </p>

          {/* Quick Stats */}
          <div className="profile-quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-value">{versesCount}</div>
              <div className="quick-stat-label">Verses</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">{rankInfo.currentRank.level}</div>
              <div className="quick-stat-label">Rank</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">{Math.round(rankInfo.progress)}%</div>
              <div className="quick-stat-label">Progress</div>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="profile-section">
          <div className="section-header-with-action">
            <h2 className="section-title-profile">Account Information</h2>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="icon-small" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="profile-form-card">
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="form-field full-width">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    className="form-input disabled"
                  />
                  <span className="field-note">Username cannot be changed</span>
                </div>

                <div className="form-field full-width">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="form-input disabled"
                  />
                  <span className="field-note">Email address cannot be changed</span>
                </div>

                <div className="form-field full-width">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="cancel-button-profile"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="icon-small" />
                  Cancel
                </button>
                <button
                  className="save-button-profile"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="button-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="icon-small" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info-card">
              <div className="info-grid">
                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">
                      {formData.firstName && formData.lastName
                        ? `${formData.firstName} ${formData.lastName}`
                        : 'Not specified'}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Username</div>
                    <div className="info-value">@{formData.username}</div>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Email</div>
                    <div className="info-value">{formData.email}</div>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Member Since</div>
                    <div className="info-value">{getMemberSince()}</div>
                  </div>
                </div>
              </div>

              {formData.bio && (
                <div className="bio-section">
                  <div className="info-label">Biography</div>
                  <p className="bio-text">{formData.bio}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="profile-section">
          <h2 className="section-title-profile">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button
              className="action-card"
              onClick={() => navigate('/memorized-verses')}
            >
              <div className="action-icon">📚</div>
              <div className="action-title">My Verses</div>
              <div className="action-description">View your collection</div>
            </button>

            <button
              className="action-card"
              onClick={() => navigate('/ranks')}
            >
              <div className="action-icon">🏆</div>
              <div className="action-title">View Journey</div>
              <div className="action-description">Check your progress</div>
            </button>

            <button
              className="action-card"
              onClick={() => navigate('/bible-search')}
            >
              <div className="action-icon">🔍</div>
              <div className="action-title">Browse Verses</div>
              <div className="action-description">Learn something new</div>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="profile-section danger-section">
          <h2 className="section-title-profile danger-title">Danger Zone</h2>
          <div className="danger-card">
            <div className="danger-item">
              <div className="danger-content">
                <h3 className="danger-heading">Logout</h3>
                <p className="danger-description">Sign out of your account</p>
              </div>
              <button
                className="danger-button-logout"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>

            <div className="danger-divider"></div>

            <div className="danger-item">
              <div className="danger-content">
                <h3 className="danger-heading">Delete Account</h3>
                <p className="danger-description">Permanently delete your account and all data</p>
              </div>
              <button
                className="danger-button-delete"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                    console.log('Account deletion requested');
                  }
                }}
              >
                <Trash2 className="icon-small" />
                Delete Account
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default UserProfile;
