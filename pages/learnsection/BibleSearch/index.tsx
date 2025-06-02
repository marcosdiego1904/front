import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleApiService, { SearchedVerse } from '../../../src/services/bibleApi';
import TranslationInfo from './TranslationInfo'; // <-- IMPORTADO
//import './BibleSearch.css'; // <-- IMPORTADO

const BibleSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id);
  const [searchedVerse, setSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const availableTranslations = bibleApiService.getAvailableTranslations();
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
      navigate('/learn', { state: { selectedVerse: searchedVerse } });
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
        <p>Search for any Bible verse in your preferred translation and start memorizing instantly</p>
      </div>

      {/* Translation Selector */}
      <div className="translation-selector">
        <label htmlFor="translation-select">Choose Translation:</label>
        <select
          id="translation-select"
          className="translation-select"
          value={selectedTranslation}
          onChange={(e) => setSelectedTranslation(e.target.value)}
          disabled={isLoading}
        >
          {availableTranslations.map((translation) => (
            <option key={translation.id} value={translation.id}>
              {translation.name} - {translation.fullName}
            </option>
          ))}
        </select>
        {/* Componente de Información de Traducción Integrado */}
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
            Searching for verse in {availableTranslations.find(t => t.id === selectedTranslation)?.name}...
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
          <strong>💡 Tip:</strong> NLT is selected by default for easier reading. Memorized verses are saved to your profile.
        </div>
      </div>
    </div>
  );
};

export default BibleSearch;