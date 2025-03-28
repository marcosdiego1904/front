import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/auth/context/AuthContext';
import { getMemorizedVerses, getVerseById } from '../../../src/services/api';
import './style.css';

interface MemorizedVerse {
  id: number;
  verse_id: number;
  verse_reference: string;
  verse_text: string;
  context_text: string;
  memorized_date: string;
}

const MemorizedVerses: React.FC = () => {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [verses, setVerses] = useState<MemorizedVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchMemorizedVerses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const data = await getMemorizedVerses(token);
        setVerses(data);
      } catch (err) {
        console.error('Error fetching memorized verses:', err);
        setError('Failed to load your memorized verses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemorizedVerses();
  }, [isAuthenticated]);
  
  const toggleVerseExpansion = (id: number) => {
    setExpandedVerse(expandedVerse === id ? null : id);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="memorized-verses-container">
        <div className="auth-required">
          <h3>Sign In Required</h3>
          <p>Please sign in to view your memorized verses.</p>
          <a href="/login" className="login-btn">Sign In</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="memorized-verses-container">
      <h2 className="section-title">My Memorized Verses</h2>
      
      {loading ? (
        <div className="loading-container">
          <div className="verse-spinner"></div>
          <p>Loading your memorized verses...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
        </div>
      ) : verses.length === 0 ? (
        <div className="no-verses-message">
          <p>You haven't memorized any verses yet.</p>
          <p>Start learning a verse to add it to your collection!</p>
          <a href="/" className="browse-verses-btn">Browse Verses</a>
        </div>
      ) : (
        <div className="verses-list">
          {verses.map(verse => (
            <div 
              key={verse.id} 
              className={`verse-card ${expandedVerse === verse.id ? 'expanded' : ''}`}
            >
              <div 
                className="verse-header" 
                onClick={() => toggleVerseExpansion(verse.id)}
              >
                <div className="verse-info">
                  <h3 className="verse-reference">{verse.verse_reference}</h3>
                  <span className="memorized-date">
                    Memorized: {formatDate(verse.memorized_date)}
                  </span>
                </div>
                <div className="expand-icon">
                  {expandedVerse === verse.id ? '−' : '+'}
                </div>
              </div>
              
              <div className="verse-content">
                <p className="verse-text">"{verse.verse_text}"</p>
                {verse.context_text && (
                  <p className="verse-context">{verse.context_text}</p>
                )}
                <div className="verse-actions">
                  <button 
                    className="practice-again-btn"
                    onClick={() => window.location.href = `/learn?verseId=${verse.verse_id}`}
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemorizedVerses;