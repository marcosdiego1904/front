// src/auth/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './DashboardStyles.css';
import '../../components/RankingStyles.css';
import RankCard from '../../components/RankCard';
import LevelUpNotification from '../../components/LevelUpNotification';
import { calculateUserRank, canLevelUp, biblicalRanks, BiblicalRank } from '../../utils/RankingSystem';

interface MemorizedVerse {
  id: number;
  verse_id: number;
  verse_reference: string;
  verse_text: string;
  context_text?: string;
  memorized_date: string;
}

interface UserRank {
  rank: string;
  progress: number;
  nextRank: string;
  versesToNextRank: number;
}

const Dashboard: React.FC = () => {
  const { user, logout, getAuthHeader, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [memorizedVerses, setMemorizedVerses] = useState<MemorizedVerse[]>([]);
  const [userRank, setUserRank] = useState<UserRank>({
    rank: "Beginner",
    progress: 0,
    nextRank: "Bronze",
    versesToNextRank: 5
  });
  const [biblicalUserRank, setBiblicalUserRank] = useState<{
    currentRank: BiblicalRank;
    progress: number;
    versesToNextRank: number;
  }>({
    currentRank: biblicalRanks[0],
    progress: 0,
    versesToNextRank: 5
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nextRank, setNextRank] = useState<BiblicalRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create refs for the sections we want to scroll to
  const dashboardRef = useRef<HTMLElement>(null);
  const userRankRef = useRef<HTMLDivElement>(null);
  const memorizedVersesRef = useRef<HTMLDivElement>(null);
  
  // Function to handle smooth scrolling
  const scrollToSection = (elementRef: React.RefObject<HTMLElement>) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close the mobile menu if it's open
      setIsMenuOpen(false);
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch memorized verses using the same API endpoint as the MemorizedVerses component
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch verses data
        const versesResponse = await axios.get(
          `${API_BASE_URL}/user/memorized-verses`,
          { headers: getAuthHeader() }
        );
        
        console.log("Verses API response:", versesResponse.data);
        
        // Process the verses data using the same structure as MemorizedVerses component
        let processedVerses: MemorizedVerse[] = [];
        
        if (versesResponse.data?.verses && Array.isArray(versesResponse.data.verses)) {
          processedVerses = versesResponse.data.verses;
        } else if (Array.isArray(versesResponse.data)) {
          processedVerses = versesResponse.data;
        } else if (versesResponse.data?.data && Array.isArray(versesResponse.data.data)) {
          processedVerses = versesResponse.data.data;
        }
        
        // Standardize the structure to match MemorizedVerse interface
        const formattedVerses = processedVerses.map((verse: any) => ({
          id: verse.id || Math.random().toString(36).substr(2, 9),
          verse_id: verse.verse_id || verse.verseId || 0,
          verse_reference: verse.verse_reference || verse.verseReference || verse.reference || "Unknown reference",
          verse_text: verse.verse_text || verse.verseText || verse.text || "No verse text available",
          context_text: verse.context_text || verse.contextText || "",
          memorized_date: verse.memorized_date || verse.memorizedDate || verse.dateMemorized || new Date().toISOString()
        }));
        
        setMemorizedVerses(formattedVerses);
        
        // Calculate biblical rank based on verses count
        const versesCount = formattedVerses.length;
        const calculatedRank = calculateUserRank(versesCount);
        setBiblicalUserRank(calculatedRank);
        
        // Find next rank
        if (calculatedRank.currentRank.nextLevel) {
          const nextRankIndex = biblicalRanks.findIndex(rank => 
            rank.level === calculatedRank.currentRank.nextLevel
          );
          if (nextRankIndex !== -1) {
            setNextRank(biblicalRanks[nextRankIndex]);
          }
        }
        
        // Check if level up is available
        const levelUpAvailable = canLevelUp(versesCount);
        if (levelUpAvailable) {
          // Not showing immediately to avoid annoying users
          // They can click the level up button when they're ready
        }
        
        // Fetch user rank data for backward compatibility
        try {
          const rankResponse = await axios.get(
            `${API_BASE_URL}/user/rank`,
            { headers: getAuthHeader() }
          );
          
          console.log("Rank API response:", rankResponse.data);
          
          if (rankResponse.data) {
            setUserRank({
              rank: rankResponse.data.rank || "Beginner",
              progress: rankResponse.data.progress || 20,
              nextRank: rankResponse.data.nextRank || "Bronze",
              versesToNextRank: rankResponse.data.versesToNextRank || 4
            });
          }
        } catch (rankError) {
          console.error("Error fetching user rank:", rankError);
          // Calculate rank based on memorized verses count
          const versesCount = formattedVerses.length;
          let calculatedRank = {
            rank: "Beginner",
            progress: 0,
            nextRank: "Bronze",
            versesToNextRank: 5
          };
          
          if (versesCount > 0) {
            // Simple progress calculation based on verses count
            calculatedRank.progress = Math.min((versesCount / 5) * 100, 100);
            calculatedRank.versesToNextRank = Math.max(5 - versesCount, 0);
          }
          
          setUserRank(calculatedRank);
        }
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load your data. Please try again later.");
        
        // Fallback data if API fails
        if (memorizedVerses.length === 0) {
          setMemorizedVerses([{
            id: 1,
            verse_id: 1,
            verse_reference: "Unknown reference",
            verse_text: "No verse text available",
            memorized_date: new Date().toISOString()
          }]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
    
    // Check if there's a hash in the URL and scroll to the corresponding section
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' && dashboardRef.current) {
        scrollToSection(dashboardRef);
      } else if (hash === '#userRank' && userRankRef.current) {
        scrollToSection(userRankRef);
      } else if (hash === '#memorizedVerses' && memorizedVersesRef.current) {
        scrollToSection(memorizedVersesRef);
      }
    };
    
    // Handle hash when component mounts
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAuthenticated, getAuthHeader]);
  
  // Format date to display in a readable format (Mar 29, 2025)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect is handled by the AuthContext
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleLevelUp = () => {
    if (canLevelUp(memorizedVerses.length)) {
      setShowLevelUp(true);
    }
  };
  
  const handleCloseNotification = () => {
    setShowLevelUp(false);
    
    // Recalculate rank after level up
    const versesCount = memorizedVerses.length;
    const calculatedRank = calculateUserRank(versesCount);
    setBiblicalUserRank(calculatedRank);
    
    // Find next rank
    if (calculatedRank.currentRank.nextLevel) {
      const nextRankIndex = biblicalRanks.findIndex(rank => 
        rank.level === calculatedRank.currentRank.nextLevel
      );
      if (nextRankIndex !== -1) {
        setNextRank(biblicalRanks[nextRankIndex]);
      } else {
        setNextRank(null);
      }
    } else {
      setNextRank(null);
    }
  };
  
  return (
    <div className="dashboard-container">
      {/* Level Up Notification */}
      <LevelUpNotification 
        show={showLevelUp}
        onClose={handleCloseNotification}
        currentRank={biblicalUserRank.currentRank}
        nextRank={nextRank}
      />
      
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
              <a href="#dashboard" onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection(dashboardRef); 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                Dashboard
              </a>
            </li>
            {/**<li>
              <a href="/profile">
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
            */}
            
            <li>
              <a href="#userRank" onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection(userRankRef); 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
                Biblical Journey
              </a>
            </li>
            
            <li>
              <a href="#memorizedVerses" onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection(memorizedVersesRef); 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Memorized Verses
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
        
        {/* Header - add ref for dashboard section */}
        <header ref={dashboardRef} id="dashboard" className="dashboard-header">
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
          
          {/* Biblical User Rank Section - add ref */}
          <div ref={userRankRef} id="userRank" className="user-rank-section">
            <div className="section-header">
              <h3>Your Biblical Journey</h3>
            </div>
            
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Calculating your journey progress...</span>
              </div>
            ) : (
              <RankCard
                currentRank={biblicalUserRank.currentRank}
                progress={biblicalUserRank.progress}
                versesToNextRank={biblicalUserRank.versesToNextRank}
                versesCount={memorizedVerses.length}
                onLevelUp={handleLevelUp}
                canLevelUp={canLevelUp(memorizedVerses.length)}
              />
            )}
          </div>
          
          {/* Memorized Verses Section - add ref */}
          <div ref={memorizedVersesRef} id="memorizedVerses" className="memorized-verses-section">
            <div className="section-header">
              <h3>Memorized Verses</h3>
              <a href="/memorized-verses" className="view-all-btn">View All</a>
            </div>
            
            {isLoading ? (
              <div className="">
                <div className=""></div>
                <span>Loading your verses...</span>
              </div>
            ) : error ? (
              <div className="error-message">
                {error}
              </div>
            ) : memorizedVerses.length > 0 ? (
              <div className="verses-list">
                {memorizedVerses.slice(0, 5).map((verse) => (
                  <div key={verse.id} className="verse-item">
                    <div className="verse-reference">{verse.verse_reference}</div>
                    <div className="verse-text">"{verse.verse_text}"</div>
                    <div className="verse-date">
                      Memorized on {formatDate(verse.memorized_date)}
                    </div>
                  </div>
                ))}
                {memorizedVerses.length > 5 && (
                  <div className="more-verses">
                    + {memorizedVerses.length - 5} more verse{memorizedVerses.length - 5 !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <p>You haven't memorized any verses yet. Start your first memorization lesson today!</p>
                <a href="/learn" className="start-lesson-btn">Start a Lesson</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;