// src/auth/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Lock, TrendingUp } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import logo from '../../oil-lamp.png';
import './DashboardStyles.css';
import './registratrion/IconFixesStyles.css';
import '../../components/RankingStyles.css';
import RankCard from '../../components/RankCard';
import LevelUpNotification from '../../components/LevelUpNotification';
import { calculateUserRank, canLevelUp, biblicalRanks, BiblicalRank } from '../../utils/RankingSystem';
import { getSubscriptionStatus } from '../../services/stripeApi';

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
  const [hasSubscription, setHasSubscription] = useState(false);
  const [versesThisMonth, setVersesThisMonth] = useState(0);
  const FREE_TIER_LIMIT = 3;
  
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

        // Calculate verses learned this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const versesThisMonthCount = formattedVerses.filter((verse: MemorizedVerse) => {
          const verseDate = new Date(verse.memorized_date);
          return verseDate >= firstDayOfMonth;
        }).length;
        setVersesThisMonth(versesThisMonthCount);

        // Check subscription status
        try {
          const subStatus = await getSubscriptionStatus(token);
          setHasSubscription(subStatus.hasSubscription);
        } catch (subError) {
          console.error('Error checking subscription:', subError);
          setHasSubscription(false);
        }
        
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
          <button
            onClick={() => handleNavClick("/subscriptions")}
            style={{
              background: 'linear-gradient(to right, #f59e0b, #f97316)',
              color: '#0f172a',
              fontWeight: '600',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              margin: '0.5rem 1rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              fontSize: '0.9375rem'
            }}
          >
            Go Premium
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
          
          {/* Premium Upgrade CTA - Only show if user doesn't have subscription */}
          {!hasSubscription && (
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              border: '3px solid #f59e0b',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  marginBottom: '1rem'
                }}>
                  <Zap style={{ width: '1rem', height: '1rem', color: '#fbbf24' }} />
                  <span style={{ color: '#fbbf24', fontSize: '0.875rem', fontWeight: '600' }}>
                    {versesThisMonth >= FREE_TIER_LIMIT ? 'Limit Reached' : `${versesThisMonth}/${FREE_TIER_LIMIT} verses this month`}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'center' }}>
                  <div>
                    <h3 style={{
                      color: 'white',
                      fontSize: '1.875rem',
                      fontWeight: 'bold',
                      marginBottom: '0.75rem',
                      fontFamily: 'Lora, serif'
                    }}>
                      {versesThisMonth >= FREE_TIER_LIMIT ?
                        "You've Hit Your Limit. Don't Stop Now." :
                        "Ready to Go Unlimited?"}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1.125rem', marginBottom: '1rem' }}>
                      {versesThisMonth >= FREE_TIER_LIMIT ?
                        "Unlock unlimited verses and keep your spiritual momentum going." :
                        "Memorize unlimited verses. No limits. No waiting. Just growth."}
                    </p>

                    {/* Value Props */}
                    <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          background: 'rgba(52, 211, 153, 0.2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <TrendingUp style={{ width: '1rem', height: '1rem', color: '#34d399' }} />
                        </div>
                        <span style={{ color: 'white', fontSize: '0.9375rem' }}>
                          Unlimited verses every month
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          background: 'rgba(96, 165, 250, 0.2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Zap style={{ width: '1rem', height: '1rem', color: '#60a5fa' }} />
                        </div>
                        <span style={{ color: 'white', fontSize: '0.9375rem' }}>
                          Advanced memory techniques that work
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          background: 'rgba(251, 191, 36, 0.2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Lock style={{ width: '1rem', height: '1rem', color: '#fbbf24' }} />
                        </div>
                        <span style={{ color: 'white', fontSize: '0.9375rem' }}>
                          Only $9.99/mo • Cancel anytime
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/subscriptions')}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(to right, #f59e0b, #f97316)',
                        color: '#0f172a',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                        padding: '1rem 2rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                        transition: 'all 0.2s',
                        fontFamily: 'Nunito Sans, sans-serif'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.3)';
                      }}
                    >
                      Upgrade to Premium →
                    </button>
                    <p style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      marginTop: '0.75rem',
                      textAlign: 'center'
                    }}>
                      30-day money-back guarantee • No questions asked
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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

            {/* View Full Journey Button */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => navigate('/ranks')}
                className="view-ranks-button"
                style={{
                  background: 'linear-gradient(to right, #F59E0B, #F97316)',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Nunito Sans', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                }}
              >
                View Full Journey →
              </button>
            </div>
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