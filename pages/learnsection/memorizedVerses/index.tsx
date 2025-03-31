import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/auth/context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../src/config/api';
import './style.css'; // Make sure to create this CSS file

interface MemorizedVerse {
  id: number;
  verseReference: string;
  verseText: string;
  dateMemorized: string;
}

interface MemorizedVersesProps {
  displayLimit?: number;
  displayMode?: 'dashboard' | 'profile'; // Add display mode for styling
}

const MemorizedVerses: React.FC<MemorizedVersesProps> = ({ 
  displayLimit,
  displayMode = 'profile'
}) => {
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [verses, setVerses] = useState<MemorizedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemorizedVerses = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/user/memorized-verses`,
          { headers: getAuthHeader() }
        );

        console.log('API Response:', response.data);

        // Handle different response formats
        let versesData = [];
        if (response.data.verses) {
          versesData = response.data.verses;
        } else if (Array.isArray(response.data)) {
          versesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          versesData = response.data.data;
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Failed to load verses. Unexpected data format.');
          setVerses([]);
        }

        // For testing - if in development mode and no verses found
        if (versesData.length === 0 && process.env.NODE_ENV === 'development') {
          versesData = [
            {
              id: 1,
              verseReference: '1 Timothy 4:12',
              verseText: 'Don\'t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.',
              dateMemorized: new Date().toISOString()
            }
          ];
        }

        setVerses(versesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching memorized verses:', err);
        setError('Failed to load your memorized verses. Please try again later.');
        
        // For testing - if in development mode
        if (process.env.NODE_ENV === 'development') {
          setVerses([
            {
              id: 1,
              verseReference: '1 Timothy 4:12',
              verseText: 'Don\'t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.',
              dateMemorized: new Date().toISOString()
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemorizedVerses();
  }, [isAuthenticated, getAuthHeader]);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown date';
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Helper to limit verses for dashboard display
  const displayVerses = displayLimit ? verses.slice(0, displayLimit) : verses;

  // Apply className based on display mode
  const containerClass = displayMode === 'dashboard' 
    ? 'memorized-verses-container dashboard-mode' 
    : 'memorized-verses-container';

  if (isLoading) {
    return (
      <div className={containerClass}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading your verses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass}>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (verses.length === 0) {
    return (
      <div className={containerClass}>
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
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="verses-list">
        {displayVerses.map((verse) => (
          <div key={verse.id} className="verse-item">
            <div className="verse-reference">{verse.verseReference}</div>
            <div className="verse-text">"{verse.verseText}"</div>
            <div className="verse-date">
              Memorized on {formatDate(verse.dateMemorized)}
            </div>
          </div>
        ))}
      </div>
      
      {displayLimit && verses.length > displayLimit && (
        <div className="more-verses">
          <a href="/profile">
            + {verses.length - displayLimit} more verse{verses.length - displayLimit !== 1 ? 's' : ''}
          </a>
        </div>
      )}
    </div>
  );
};

export default MemorizedVerses;