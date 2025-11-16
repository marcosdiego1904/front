import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Search, Award, Library, Flame } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Dashboard.css';
import { calculateUserRank } from '../../utils/RankingSystem';

interface MemorizedVerse {
  id: number;
  verse_id: number;
  verse_reference: string;
  verse_text: string;
  context_text?: string;
  memorized_date: string;
}

interface RecommendedVerse {
  reference: string;
  text: string;
  category: string;
}

const RECOMMENDED_VERSES: RecommendedVerse[] = [
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    category: "Strength"
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    category: "Trust"
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    category: "Courage"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
    category: "Hope"
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    category: "Faith"
  },
  {
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, an ever-present help in trouble.",
    category: "Comfort"
  },
  {
    reference: "Matthew 6:33",
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    category: "Priorities"
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    category: "Renewal"
  }
];

const Dashboard = () => {
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [memorizedVerses, setMemorizedVerses] = useState<MemorizedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedVerse, setRecommendedVerse] = useState<RecommendedVerse>(RECOMMENDED_VERSES[0]);
  const [streak, setStreak] = useState(7); // Mock streak for now

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);

      try {
        const versesResponse = await axios.get(
          `${API_BASE_URL}/user/memorized-verses`,
          { headers: getAuthHeader() }
        );

        let processedVerses: MemorizedVerse[] = [];

        if (versesResponse.data?.verses && Array.isArray(versesResponse.data.verses)) {
          processedVerses = versesResponse.data.verses;
        } else if (Array.isArray(versesResponse.data)) {
          processedVerses = versesResponse.data;
        } else if (versesResponse.data?.data && Array.isArray(versesResponse.data.data)) {
          processedVerses = versesResponse.data.data;
        }

        const formattedVerses = processedVerses.map((verse: any) => ({
          id: verse.id || Math.random().toString(36).substr(2, 9),
          verse_id: verse.verse_id || verse.verseId || 0,
          verse_reference: verse.verse_reference || verse.verseReference || verse.reference || "Unknown reference",
          verse_text: verse.verse_text || verse.verseText || verse.text || "No verse text available",
          context_text: verse.context_text || verse.contextText || "",
          memorized_date: verse.memorized_date || verse.memorizedDate || verse.dateMemorized || new Date().toISOString()
        }));

        // Sort by most recent
        formattedVerses.sort((a, b) =>
          new Date(b.memorized_date).getTime() - new Date(a.memorized_date).getTime()
        );

        setMemorizedVerses(formattedVerses);

        // Set random recommended verse
        const randomIndex = Math.floor(Math.random() * RECOMMENDED_VERSES.length);
        setRecommendedVerse(RECOMMENDED_VERSES[randomIndex]);

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAuthHeader]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      if (days < 7) return `${days} days ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const getThisWeekStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const versesThisWeek = memorizedVerses.filter(verse => {
      const verseDate = new Date(verse.memorized_date);
      return verseDate >= weekAgo;
    }).length;

    return versesThisWeek;
  };

  const versesCount = memorizedVerses.length;
  const rankInfo = calculateUserRank(versesCount);
  const versesThisWeek = getThisWeekStats();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container-new">

        {/* 1. Welcome Hero Section */}
        <section className="welcome-hero">
          <h1 className="welcome-title">
            Welcome back, {user?.username || 'User'}! 👋
          </h1>

          <div className="stats-badges">
            {/* Current Rank Badge */}
            <div className="stat-badge rank-badge">
              <div className="stat-icon rank-icon">
                {rankInfo.currentRank.icon}
              </div>
              <div className="stat-content">
                <div className="stat-label">Current Rank</div>
                <div className="stat-value">{rankInfo.currentRank.level}</div>
              </div>
            </div>

            {/* Streak Badge */}
            <div className="stat-badge streak-badge">
              <div className="stat-icon streak-icon">
                <Flame />
              </div>
              <div className="stat-content">
                <div className="stat-label">Learning Streak</div>
                <div className="stat-value">{streak} days</div>
              </div>
            </div>

            {/* Verses Count Badge */}
            <div className="stat-badge verses-badge">
              <div className="stat-icon verses-icon">
                <BookOpen />
              </div>
              <div className="stat-content">
                <div className="stat-label">Verses Memorized</div>
                <div className="stat-value">{versesCount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Primary CTA - Continue Learning */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-icon">🔥</div>
            <h2 className="cta-title">Ready for Your Next Verse?</h2>
            <p className="cta-subtitle">Continue your spiritual journey today</p>
            <button
              className="cta-button"
              onClick={() => navigate('/bible-search')}
            >
              Continue Learning →
            </button>
          </div>
        </section>

        {/* 3 & 4. Recent Activity + Recommended Verse (Two Columns) */}
        <div className="two-column-section">
          {/* Recent Activity */}
          <section className="recent-activity">
            <h3 className="section-title">Recently Memorized</h3>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your verses...</p>
              </div>
            ) : memorizedVerses.length > 0 ? (
              <>
                <div className="recent-verses-list">
                  {memorizedVerses.slice(0, 5).map((verse) => (
                    <div key={verse.id} className="recent-verse-item">
                      <div className="verse-checkmark">✓</div>
                      <div className="verse-details">
                        <div className="verse-ref">{verse.verse_reference}</div>
                        <div className="verse-date">{formatDate(verse.memorized_date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="view-all-link"
                  onClick={() => navigate('/memorized-verses')}
                >
                  View All Verses →
                </button>
              </>
            ) : (
              <div className="empty-recent">
                <p className="empty-text">Start your journey - memorize your first verse!</p>
                <button
                  className="start-learning-btn"
                  onClick={() => navigate('/bible-search')}
                >
                  Browse Verses
                </button>
              </div>
            )}
          </section>

          {/* Recommended Verse */}
          <section className="recommended-verse">
            <h3 className="section-title">Suggested For You</h3>
            <div className="verse-card">
              <div className="verse-category-badge">{recommendedVerse.category}</div>
              <div className="verse-reference-large">{recommendedVerse.reference}</div>
              <p className="verse-text-large">"{recommendedVerse.text}"</p>
              <button
                className="learn-verse-btn"
                onClick={() => navigate('/bible-search')}
              >
                Learn This Verse →
              </button>
            </div>
          </section>
        </div>

        {/* 5 & 6. This Week Summary + Quick Links (Two Columns) */}
        <div className="two-column-section">
          {/* This Week Summary */}
          <section className="week-summary">
            <h3 className="section-title">This Week</h3>
            <div className="summary-card">
              <div className="summary-item">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <div className="summary-value">{versesThisWeek}</div>
                  <div className="summary-label">Verses memorized</div>
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-icon">🔥</div>
                <div className="summary-content">
                  <div className="summary-value">{streak}</div>
                  <div className="summary-label">Day streak</div>
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-icon">🎯</div>
                <div className="summary-content">
                  <div className="summary-value">{Math.round(rankInfo.progress)}%</div>
                  <div className="summary-label">Progress to {rankInfo.currentRank.nextLevel || 'Max'}</div>
                </div>
              </div>

              <button
                className="view-journey-link"
                onClick={() => navigate('/ranks')}
              >
                View Full Journey →
              </button>
            </div>
          </section>

          {/* Quick Links */}
          <section className="quick-links">
            <h3 className="section-title">Quick Links</h3>
            <div className="quick-links-grid">
              <button
                className="quick-link-card"
                onClick={() => navigate('/bible-search')}
              >
                <Search className="quick-link-icon" />
                <span className="quick-link-label">Browse Verses</span>
              </button>

              <button
                className="quick-link-card"
                onClick={() => navigate('/ranks')}
              >
                <Award className="quick-link-icon" />
                <span className="quick-link-label">View Journey</span>
              </button>

              <button
                className="quick-link-card"
                onClick={() => navigate('/memorized-verses')}
              >
                <Library className="quick-link-icon" />
                <span className="quick-link-label">My Collection</span>
              </button>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
