import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import MemorizedVerses from '../../../pages/learnsection/memorizedVerses';
import './DashboardStyles.css';

interface UserRank {
  rank: string;
  progress: number;
  nextRank: string;
  versesToNextRank: number;
}

const Dashboard: React.FC = () => {
  const { user, logout, getAuthHeader, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRank, setUserRank] = useState<UserRank>({
    rank: "Beginner",
    progress: 30,
    nextRank: "Bronze",
    versesToNextRank: 4
  });
  
  useEffect(() => {
    const fetchUserRank = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Fetch user rank (when this endpoint is implemented)
        const rankResponse = await axios.get(
          `${API_BASE_URL}/user/rank`,
          { headers: getAuthHeader() }
        );
        
        setUserRank(rankResponse.data || {
          rank: "Beginner",
          progress: 30,
          nextRank: "Bronze",
          versesToNextRank: 4
        });
      } catch (error) {
        console.error("Failed to fetch user rank:", error);
      }
    };
    
    fetchUserRank();
  }, [isAuthenticated, getAuthHeader]);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect is handled by the AuthContext
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="lamp-icon">
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
          <h1 className="sidebar-title">Lamp to my feet</h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </a>
            </li>
            <li>
              <a href="#settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-main">
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        
        {/* Header */}
        <header className="dashboard-header">
          <h1>Dashboard</h1>
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
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome back, {user?.username || 'User'}!</h2>
            <p>Here's what's happening with your account today.</p>
          </div>
          
          {/* User Rank Section */}
          <div className="user-rank-section">
            <div className="section-header">
              <h3>Your Current Rank</h3>
            </div>
            
            <div className="rank-card">
              <div className="rank-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
                <span className="rank-title">{userRank.rank}</span>
              </div>
              <div className="rank-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${userRank.progress}%` }}
                  ></div>
                </div>
                <div className="rank-info">
                  <span>{userRank.versesToNextRank} more verse{userRank.versesToNextRank !== 1 ? 's' : ''} to reach {userRank.nextRank}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Memorized Verses Section - Using the shared component */}
          <div className="memorized-verses-section">
            <div className="section-header">
              <h3>Memorized Verses</h3>
              <a href="/profile" className="view-all-btn">View All</a>
            </div>
            
            {/* Use the same component that works in the Profile */}
            <MemorizedVerses displayLimit={5} displayMode="dashboard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;