import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

const UserProfile: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
      <div className="user-profile-section">
        <div className="up-profile-content">
          <p>Cargando perfil...</p>
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
    <div className="user-profile-section">
      <div className="up-profile-content">
        <div className="up-profile-card">
          <div className="up-profile-header">
            <div className="up-profile-avatar-large">
              {getInitials()}
            </div>
            <div className="up-profile-info">
              <h2>{formData.firstName} {formData.lastName}</h2>
              <div className="up-username">@{formData.username}</div>
              {!isEditing && (
                <button 
                  className="up-edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form className="up-profile-form" onSubmit={handleSubmit}>
              <div className="up-form-row">
                <div className="up-form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="up-form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="up-form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  disabled
                />
                <span className="up-input-note">
                  El nombre de usuario no se puede cambiar.
                </span>
              </div>

              <div className="up-form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <span className="up-input-note">
                  El correo electrónico no se puede cambiar.
                </span>
              </div>

              <div className="up-form-group">
                <label htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              <div className="up-form-actions">
                <button
                  type="button"
                  className="up-cancel-button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`up-save-button ${loading ? 'up-loading' : ''}`}
                  disabled={loading}
                >
                  {loading && (
                    <span className="up-spinner">⟳</span>
                  )}
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="up-profile-details">
              <div className="up-detail-group">
                <h3>Información Personal</h3>
                
                <div className="up-detail-item">
                  <div className="up-detail-label">Nombre</div>
                  <div className="up-detail-value">
                    {formData.firstName} {formData.lastName || 'No especificado'}
                  </div>
                </div>
                
                <div className="up-detail-item">
                  <div className="up-detail-label">Usuario</div>
                  <div className="up-detail-value">@{formData.username}</div>
                </div>
                
                <div className="up-detail-item">
                  <div className="up-detail-label">Email</div>
                  <div className="up-detail-value">{formData.email}</div>
                </div>
                
                <div className="up-detail-item">
                  <div className="up-detail-label">Miembro desde</div>
                  <div className="up-detail-value">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'No disponible'}
                  </div>
                </div>
                
                <div className="up-detail-item">
                  <div className="up-detail-label">Último acceso</div>
                  <div className="up-detail-value">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'No disponible'}
                  </div>
                </div>
              </div>
              
              <div className="up-detail-group">
                <h3>Biografía</h3>
                <div className="up-detail-value up-bio-text">
                  {formData.bio || 'No has agregado una biografía todavía.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;