import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Search, Award, Library, Flame } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Dashboard.css';
import { calculateUserRank } from '../../utils/RankingSystem';
import bibleApiService from '../../services/bibleApi';

interface MemorizedVerse {
  id: number;
  verse_id: number;
  verse_reference: string;
  verse_text: string;
  context_text?: string;
  memorized_date: string;
}

interface SuggestedVerse {
  reference: string;
  text: string;
  category: string;
}

// Expanded pool of suggested verses - just references, text fetched from API
const SUGGESTED_VERSE_POOL = [
  // Popular Favorites
  "John 3:16",
  "Philippians 4:13",
  "Jeremiah 29:11",
  "Romans 8:28",
  "Proverbs 3:5-6",

  // Strength & Courage
  "Joshua 1:9",
  "Isaiah 40:31",
  "Psalm 46:1",
  "Ephesians 6:10",
  "2 Timothy 1:7",
  "Deuteronomy 31:6",

  // Peace & Comfort
  "Philippians 4:6-7",
  "Matthew 11:28",
  "John 14:27",
  "Psalm 23:1",
  "Isaiah 26:3",
  "2 Thessalonians 3:16",

  // Love
  "1 Corinthians 13:4-5",
  "1 John 4:8",
  "John 13:34",
  "Romans 5:8",
  "1 John 4:19",

  // Wisdom & Guidance
  "James 1:5",
  "Psalm 32:8",
  "Proverbs 16:3",
  "Isaiah 30:21",
  "Psalm 119:105",

  // Faith & Trust
  "Hebrews 11:1",
  "2 Corinthians 5:7",
  "Mark 11:24",
  "Proverbs 3:5",
  "Matthew 21:22",

  // Hope & Joy
  "Romans 15:13",
  "Nehemiah 8:10",
  "Psalm 30:5",
  "Lamentations 3:22-23",
  "Psalm 42:11",

  // Protection & Safety
  "Psalm 91:1-2",
  "Psalm 121:7-8",
  "Proverbs 18:10",
  "2 Samuel 22:3",

  // Forgiveness & Grace
  "1 John 1:9",
  "Ephesians 2:8-9",
  "Colossians 3:13",
  "Micah 7:18",

  // Victory & Overcoming
  "1 Corinthians 15:57",
  "Romans 8:37",
  "1 John 5:4",
  "Philippians 4:13",

  // Purpose & Plans
  "Ephesians 2:10",
  "Romans 12:2",
  "Jeremiah 1:5",
  "Psalm 37:4",

  // Prayer & Worship
  "Matthew 6:33",
  "1 Thessalonians 5:16-18",
  "Psalm 100:4",
  "John 4:24"
];

const Dashboard = () => {
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [memorizedVerses, setMemorizedVerses] = useState<MemorizedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedVerse, setSuggestedVerse] = useState<SuggestedVerse | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
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

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAuthHeader]);

  // Fetch suggested verse from API
  useEffect(() => {
    const fetchSuggestedVerse = async () => {
      if (memorizedVerses.length === 0 && !isLoading) {
        // Wait for memorized verses to load first
        return;
      }

      setIsLoadingSuggestion(true);

      try {
        // Filter out verses already memorized
        const availableVerses = SUGGESTED_VERSE_POOL.filter(
          ref => !memorizedVerses.some(v =>
            v.verse_reference.toLowerCase().includes(ref.toLowerCase()) ||
            ref.toLowerCase().includes(v.verse_reference.toLowerCase())
          )
        );

        // If all verses are memorized, use the full pool
        const versePool = availableVerses.length > 0 ? availableVerses : SUGGESTED_VERSE_POOL;

        // Pick a random verse reference
        const randomIndex = Math.floor(Math.random() * versePool.length);
        const selectedReference = versePool[randomIndex];

        // Fetch the verse from the API
        const verseData = await bibleApiService.searchVerse(selectedReference, 'kjv');

        // Determine category based on the verse
        const category = getCategoryForVerse(selectedReference);

        setSuggestedVerse({
          reference: verseData.verse_reference,
          text: verseData.text_nlt,
          category: category
        });

      } catch (error) {
        console.error("Failed to fetch suggested verse:", error);
        // Set a fallback verse if API fails
        setSuggestedVerse({
          reference: "John 3:16",
          text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          category: "Love"
        });
      } finally {
        setIsLoadingSuggestion(false);
      }
    };

    if (!isLoading) {
      fetchSuggestedVerse();
    }
  }, [memorizedVerses, isLoading]);

  // Helper function to determine category based on verse reference
  const getCategoryForVerse = (reference: string): string => {
    const ref = reference.toLowerCase();

    if (ref.includes('john 3:16') || ref.includes('1 john') || ref.includes('1 corinthians 13')) return 'Love';
    if (ref.includes('philippians 4:13') || ref.includes('joshua 1:9') || ref.includes('ephesians 6:10')) return 'Strength';
    if (ref.includes('psalm 23') || ref.includes('philippians 4:6') || ref.includes('matthew 11:28')) return 'Peace';
    if (ref.includes('proverbs') || ref.includes('james 1:5')) return 'Wisdom';
    if (ref.includes('jeremiah 29:11') || ref.includes('romans 15:13')) return 'Hope';
    if (ref.includes('hebrews 11:1') || ref.includes('2 corinthians 5:7')) return 'Faith';
    if (ref.includes('psalm 91') || ref.includes('psalm 121')) return 'Protection';
    if (ref.includes('1 john 1:9') || ref.includes('ephesians 2:8')) return 'Grace';
    if (ref.includes('1 corinthians 15:57') || ref.includes('romans 8:37')) return 'Victory';
    if (ref.includes('isaiah 40:31') || ref.includes('nehemiah 8:10')) return 'Joy';

    return 'Inspiration';
  };

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

          {/* Suggested Verse */}
          <section className="recommended-verse">
            <h3 className="section-title">Suggested For You</h3>
            {isLoadingSuggestion ? (
              <div className="verse-card">
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Finding the perfect verse for you...</p>
                </div>
              </div>
            ) : suggestedVerse ? (
              <div className="verse-card">
                <div className="verse-category-badge">{suggestedVerse.category}</div>
                <div className="verse-reference-large">{suggestedVerse.reference}</div>
                <p className="verse-text-large">"{suggestedVerse.text}"</p>
                <button
                  className="learn-verse-btn"
                  onClick={() => navigate('/bible-search')}
                >
                  Learn This Verse →
                </button>
              </div>
            ) : (
              <div className="verse-card">
                <p className="empty-text">No suggestion available</p>
              </div>
            )}
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
