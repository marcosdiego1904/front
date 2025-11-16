import { useState, useEffect } from 'react';
import { useAuth } from '../../../src/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Calendar, X } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../../src/config/api';
import { calculateUserRank } from '../../../src/utils/RankingSystem';
import './style.css';

interface MemorizedVerse {
  id: number;
  verse_id: number;
  verse_reference: string;
  verse_text: string;
  context_text?: string;
  memorized_date: string;
}

const MemorizedVerses = () => {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<MemorizedVerse[]>([]);
  const [filteredVerses, setFilteredVerses] = useState<MemorizedVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);

  useEffect(() => {
    const fetchMemorizedVerses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

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

        const formattedVerses = processedVerses.map((verse: any) => ({
          id: verse.id || Math.random().toString(36).substr(2, 9),
          verse_id: verse.verse_id || verse.verseId || 0,
          verse_reference: verse.verse_reference || verse.verseReference || verse.reference || "Unknown",
          verse_text: verse.verse_text || verse.verseText || verse.text || "",
          context_text: verse.context_text || verse.contextText || "",
          memorized_date: verse.memorized_date || verse.memorizedDate || verse.dateMemorized || new Date().toISOString()
        }));

        setVerses(formattedVerses);
        setFilteredVerses(formattedVerses);
      } catch (error) {
        console.error('Error fetching memorized verses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemorizedVerses();
  }, [isAuthenticated, getAuthHeader]);

  // Filter and search logic
  useEffect(() => {
    let result = [...verses];

    // Search filter
    if (searchQuery) {
      result = result.filter(verse =>
        verse.verse_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.verse_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Book filter
    if (selectedBook !== 'all') {
      result = result.filter(verse =>
        verse.verse_reference.toLowerCase().startsWith(selectedBook.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.memorized_date).getTime() - new Date(a.memorized_date).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.memorized_date).getTime() - new Date(b.memorized_date).getTime());
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.verse_reference.localeCompare(b.verse_reference));
    }

    setFilteredVerses(result);
  }, [searchQuery, selectedBook, sortBy, verses]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const getBooks = () => {
    const books = new Set(verses.map(v => v.verse_reference.split(' ')[0]));
    return Array.from(books).sort();
  };

  const getUniqueBooks = () => {
    const books = new Set(verses.map(v => v.verse_reference.split(' ')[0]));
    return books.size;
  };

  const toggleExpand = (id: number) => {
    setExpandedVerse(expandedVerse === id ? null : id);
  };

  const versesCount = verses.length;
  const rankInfo = calculateUserRank(versesCount);
  const uniqueBooks = getUniqueBooks();

  if (!isAuthenticated) {
    return (
      <div className="collection-page">
        <div className="collection-container">
          <div className="auth-required-card">
            <h2>Sign In Required</h2>
            <p>Please sign in to view your verse collection.</p>
            <button onClick={() => navigate('/login')} className="signin-btn">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <div className="collection-container">

        {/* Hero Section */}
        <section className="collection-hero">
          <h1 className="collection-title">My Verses Collection 📚</h1>
          <p className="collection-subtitle">Your treasure of memorized Scripture</p>

          <div className="collection-stats">
            <div className="stat-card-collection">
              <div className="stat-icon-collection">
                <BookOpen />
              </div>
              <div className="stat-content-collection">
                <div className="stat-value-collection">{versesCount}</div>
                <div className="stat-label-collection">Verses</div>
              </div>
            </div>

            <div className="stat-card-collection">
              <div className="stat-icon-collection rank-icon-collection">
                {rankInfo.currentRank.icon}
              </div>
              <div className="stat-content-collection">
                <div className="stat-value-collection">{rankInfo.currentRank.level}</div>
                <div className="stat-label-collection">Current Rank</div>
              </div>
            </div>

            <div className="stat-card-collection">
              <div className="stat-icon-collection">📖</div>
              <div className="stat-content-collection">
                <div className="stat-value-collection">{uniqueBooks}</div>
                <div className="stat-label-collection">Books</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        {verses.length > 0 && (
          <section className="filter-section">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search verses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                  <X className="clear-icon" />
                </button>
              )}
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">Book</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Books</option>
                  {getBooks().map(book => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Verses Grid */}
        <section className="verses-section">
          {loading ? (
            <div className="loading-state-collection">
              <div className="loading-spinner-collection"></div>
              <p>Loading your verses...</p>
            </div>
          ) : filteredVerses.length === 0 && verses.length > 0 ? (
            <div className="empty-state-collection">
              <p className="empty-title">No verses found</p>
              <p className="empty-text">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBook('all');
                }}
                className="reset-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : verses.length === 0 ? (
            <div className="empty-state-collection">
              <div className="empty-icon">📖</div>
              <p className="empty-title">Your collection is empty</p>
              <p className="empty-text">Start memorizing verses to build your collection!</p>
              <button
                onClick={() => navigate('/bible-search')}
                className="browse-btn"
              >
                Browse Verses
              </button>
            </div>
          ) : (
            <div className="verses-grid">
              {filteredVerses.map((verse) => (
                <div
                  key={verse.id}
                  className={`verse-card-collection ${expandedVerse === verse.id ? 'expanded' : ''}`}
                >
                  <div
                    className="verse-card-header"
                    onClick={() => toggleExpand(verse.id)}
                  >
                    <div className="verse-ref-header">{verse.verse_reference}</div>
                    <div className="expand-btn">
                      {expandedVerse === verse.id ? '−' : '+'}
                    </div>
                  </div>

                  <div className="verse-preview">
                    {verse.verse_text.substring(0, 80)}
                    {verse.verse_text.length > 80 && '...'}
                  </div>

                  <div className="verse-card-footer">
                    <div className="verse-date">
                      <Calendar className="date-icon" />
                      {formatDate(verse.memorized_date)}
                    </div>
                  </div>

                  {expandedVerse === verse.id && (
                    <div className="verse-expanded-content">
                      <p className="verse-full-text">"{verse.verse_text}"</p>
                      {verse.context_text && (
                        <p className="verse-context">{verse.context_text}</p>
                      )}
                      <button
                        onClick={() => navigate('/bible-search')}
                        className="practice-btn"
                      >
                        Practice Again
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default MemorizedVerses;
