import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleApiService, { SearchedVerse } from '../../../src/services/bibleApi';
import TranslationInfo from './TranslationInfo';

const BibleSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedVerse, setSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Solo KJV disponible
  const availableTranslations = bibleApiService.getAvailableTranslations();
  const selectedTranslation = bibleApiService.getDefaultTranslation().id; // Siempre KJV
  const examplesByCategory = bibleApiService.getExampleReferences();

  const searchVerse = async () => {
    const validation = bibleApiService.validateReference(searchInput);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid reference');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchedVerse(null);

    try {
      const verse = await bibleApiService.searchVerse(searchInput, selectedTranslation);
      setSearchedVerse(verse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search verse. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startLearning = () => {
    if (searchedVerse) {
      console.log("🔍 DEBUGGING - Verso original de Bible Search:", searchedVerse);
      
      // Crear objeto compatible con el sistema de guardado existente
      const normalizedVerse = {
        id: searchedVerse.id,
        text_nlt: searchedVerse.text_nlt,
        verse_reference: searchedVerse.verse_reference,
        context_nlt: searchedVerse.context_nlt,
      };
      
      console.log("🔍 DEBUGGING - Verso normalizado:", normalizedVerse);
      console.log("🔍 DEBUGGING - Tipo de ID:", typeof normalizedVerse.id);
      
      navigate('/learn', { state: { selectedVerse: normalizedVerse } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchVerse();
    }
  };

  const handleExampleClick = (reference: string) => {
    setSearchInput(reference);
    setError(null);
  };

  return (
    <div className="bible-search-container">
      <div className="search-header">
        <h1>Bible Search</h1>
        <p>Search for any Bible verse in the classic King James Version and start memorizing instantly</p>
      </div>

      {/* Translation Info - Simplified since only KJV */}
      <div className="translation-info-section">
        <div className="current-translation-display">
          <div className="translation-badge">
            <span className="translation-icon">📖</span>
            <div className="translation-details">
              <span className="translation-name">King James Version</span>
              <span className="translation-abbr">KJV</span>
            </div>
          </div>
        </div>
        
        {/* Componente de Información de Traducción */}
        <TranslationInfo
          translations={availableTranslations}
          selectedTranslation={selectedTranslation}
        />
      </div>

      {/* Search Input */}
      <div className="search-input-group">
        <input
          type="text"
          className="search-input-field"
          placeholder="Enter Bible reference (e.g., John 3:16)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="search-button"
          onClick={searchVerse}
          disabled={isLoading || !searchInput.trim()}
        >
          {isLoading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            Searching for verse in King James Version...
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchedVerse && !isLoading && (
        <div className="verse-card">
          <div className="verse-card-header">
            <h3>{searchedVerse.verse_reference}</h3>
            <p>{searchedVerse.context_nlt}</p>
          </div>
          
          <div className="verse-card-content">
            <p className="verse-text">"{searchedVerse.text_nlt}"</p>
          </div>
          
          <div className="verse-card-actions">
            <button className="action-button primary-action" onClick={startLearning}>
              📚 Learn This Verse
            </button>
            <button
              className="action-button secondary-action"
              onClick={() => {
                setSearchedVerse(null);
                setSearchInput('');
                setError(null);
              }}
            >
              🔍 Search Another
            </button>
          </div>
        </div>
      )}

      {/* Example Verses */}
      {!searchedVerse && !isLoading && (
        <div className="examples-section">
          <h3>Popular Verses to Try:</h3>
          {examplesByCategory.map((category, index) => (
            <div key={index} className="example-category">
              <h4>{category.category}</h4>
              <div className="example-buttons">
                {category.verses.map((verse) => (
                  <button
                    key={verse}
                    className="example-button"
                    onClick={() => handleExampleClick(verse)}
                    disabled={isLoading}
                  >
                    {verse}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions-section">
        <h3>How to search:</h3>
        <div className="instructions-grid">
          <div><strong>Book Chapter:Verse</strong><br /><span>John 3:16, Romans 8:28</span></div>
          <div><strong>With numbers</strong><br /><span>1 Corinthians 13:4, 2 Timothy 3:16</span></div>
          <div><strong>Verse ranges</strong><br /><span>John 3:16-17, Psalm 23:1-3</span></div>
          <div><strong>Full chapters</strong><br /><span>Psalm 23, Romans 8</span></div>
        </div>
        <div className="instructions-tip">
          <strong>💡 Tip:</strong> All verses are from the classic King James Version. Memorized verses are saved to your profile.
        </div>
      </div>

      {/* Agregar estilos para la nueva sección de traducción */}
      <style>{`
        .translation-info-section {
          margin-bottom: 1.5rem;
        }
        
        .current-translation-display {
          margin-bottom: 1rem;
        }
        
        .translation-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: #16223d;
          color: white;
          border-radius: 8px;
          max-width: 300px;
          margin: 0 auto;
        }
        
        .translation-icon {
          font-size: 1.5rem;
        }
        
        .translation-details {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        
        .translation-name {
          font-weight: 600;
          font-size: 1rem;
        }
        
        .translation-abbr {
          font-size: 0.8rem;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default BibleSearch;