// src/auth/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import logo from '../../oil-lamp.png';
import './DashboardStyles.css';
import './registratrion/IconFixesStyles.css';
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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  const [showAllVerses, setShowAllVerses] = useState(false);
  
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

  const handleNavClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setDrawerOpen(false);
  };

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="intro-navbar">
        <div className="intro-navbar-container">
          <div className="intro-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="intro-navbar-button"
            >
              <Menu className="h-5 w-5" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="Lamp Icon" className="intro-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`intro-drawer-overlay ${drawerOpen ? "intro-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`intro-drawer ${drawerOpen ? "intro-drawer-open" : ""}`}>
        <div className="intro-drawer-header">
          <div className="intro-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="intro-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="intro-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="intro-drawer-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="intro-drawer-nav">
          <button onClick={() => handleNavClick("/")} className="intro-drawer-link">
            Home
          </button>
          <button onClick={() => handleNavClick("/bible-search")} className="intro-drawer-link">
            Bible Search
          </button>
          <button onClick={() => handleNavClick("/about")} className="intro-drawer-link">
            About
          </button>
          <button onClick={() => handleNavClick("/support")} className="intro-drawer-link">
            Support Us
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNavClick("/dashboard")} className="intro-drawer-link">
              Dashboard
            </button>
          )}

          <div className="intro-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button onClick={handleLoginClick} className="intro-drawer-link">
                  Log In
                </button>
                <div className="intro-drawer-cta">
                  <button onClick={handleStartClick} className="intro-drawer-cta-button">
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="intro-drawer-cta">
                <button onClick={handleLogout} className="intro-drawer-cta-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="dashboard-container">
        {/* Level Up Notification */}
        <LevelUpNotification
          show={showLevelUp}
          onClose={handleCloseNotification}
          currentRank={biblicalUserRank.currentRank}
          nextRank={nextRank}
        />

        {/* Old Sidebar Removed - now using navbar with drawer above */}

        {/* Main Content */}
        <div className="dashboard-main">
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
            <div className="welcome-badge">
              <span className="badge-icon">🕊️</span>
              <span className="badge-text">Your Biblical Journey</span>
            </div>
            <h2>Welcome back, {user?.username || 'User'}!</h2>
            <p>Here's what's happening with your account today.</p>
          </div>
          
          {/* Biblical User Rank Section - add ref */}
          <div ref={userRankRef} id="userRank" className="user-rank-section">
            <div className="section-header">
              <h3>Your Biblical Journey</h3>
            </div>
            
            {isLoading ? (
              <div className="">
                <div className=""></div>
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
              {memorizedVerses.length > 5 && (
                <button onClick={() => setShowAllVerses(!showAllVerses)} className="view-all-btn">
                  {showAllVerses ? 'Show Less' : 'View All'}
                </button>
              )}
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
                {(showAllVerses ? memorizedVerses : memorizedVerses.slice(0, 5)).map((verse) => (
                  <div key={verse.id} className="verse-item">
                    <div className="verse-reference">{verse.verse_reference}</div>
                    <div className="verse-text">"{verse.verse_text}"</div>
                    <div className="verse-date">
                      Memorized on {formatDate(verse.memorized_date)}
                    </div>
                  </div>
                ))}
                {!showAllVerses && memorizedVerses.length > 5 && (
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
    </>
  );
};

export default Dashboard;