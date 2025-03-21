import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardStyles.css';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, value, change, isPositive }) => {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value">{value}</div>
        {change && (
          <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
    {/** */}  <div className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
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
          
          {/* Metrics Cards */}
          <div className="metrics-grid">
            <DashboardCard 
              title="Daily Progress" 
              value="75%" 
              change="12%" 
              isPositive={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              }
            />
            
            <DashboardCard 
              title="Contributions" 
              value="32" 
              change="8%" 
              isPositive={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              }
            />
            
            <DashboardCard 
              title="Tasks Completed" 
              value="12/15" 
              change="92%" 
              isPositive={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
            />
            
            <DashboardCard 
              title="Weekly Goal" 
              value="4/7" 
              change="2%" 
              isPositive={false}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              }
            />
          </div>
          
          {/* Recent Activity Section */}
          <div className="activity-section">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <button className="view-all-btn">View All</button>
            </div>
            
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon completed">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="activity-details">
                  <h4>Daily Reading Completed</h4>
                  <p>You've completed your daily reading goal!</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon progress">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="activity-details">
                  <h4>Weekly Progress Updated</h4>
                  <p>Your progress has been updated!</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon reminder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div className="activity-details">
                  <h4>Upcoming Event Reminder</h4>
                  <p>Don't forget about tomorrow's event!</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;