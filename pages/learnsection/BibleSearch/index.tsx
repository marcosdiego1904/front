import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleApiService, { SearchedVerse } from '../../../src/services/bibleApi';
import TranslationInfo from './TranslationInfo';

const BibleSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedVerse, setSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id);
  const navigate = useNavigate();

  // Obtener todas las traducciones disponibles
  const availableTranslations = bibleApiService.getAvailableTranslations();
  const examplesByCategory = bibleApiService.getExampleReferences();

  const searchVerse = async (customTranslation?: string) => {
    const validation = bibleApiService.validateReference(searchInput);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid reference');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchedVerse(null);

    // Usar la traducción personalizada si se proporciona, si no usar la seleccionada
    const translationToUse = customTranslation || selectedTranslation;
    console.log('🔍 Searching with translation:', translationToUse);

    try {
      const verse = await bibleApiService.searchVerse(searchInput, translationToUse);
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

  const handleTranslationChange = (translationId: string) => {
    setSelectedTranslation(translationId);
    setError(null);
    // Si hay un verso buscado, búscalo de nuevo con la nueva traducción
    if (searchedVerse && searchInput.trim()) {
      console.log('🔄 Translation changed to:', translationId, 'Re-searching verse:', searchInput);
      // Limpiar el verso actual para mostrar loading
      setSearchedVerse(null);
      setIsLoading(true);
      
      // Small delay to allow state to update, then search with new translation
      setTimeout(async () => {
        try {
          const verse = await bibleApiService.searchVerse(searchInput, translationId);
          setSearchedVerse(verse);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to search verse with new translation.');
        } finally {
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const getCurrentTranslation = () => {
    return availableTranslations.find(t => t.id === selectedTranslation) || availableTranslations[0];
  };

  return (
    <div className="bible-search-container">
      <div className="bible-search-layout-main">
        {/* Columna Izquierda: Controles de Búsqueda */}
        <div className="search-controls-column">
          <div className="search-header">
            <h1>Bible Search</h1>
            <p>Search for any Bible verse and start memorizing instantly</p>
          </div>

          {/* Translation Selection */}
          <div className="translation-selection-section">
            <div className="translation-selector">
              <label htmlFor="translation-select">Choose Translation:</label>
              <select
                id="translation-select"
                value={selectedTranslation}
                onChange={(e) => handleTranslationChange(e.target.value)}
                className="translation-select"
              >
                {availableTranslations.map((translation) => (
                  <option key={translation.id} value={translation.id}>
                    {translation.name} - {translation.fullName}
                  </option>
                ))}
              </select>
              <TranslationInfo selectedTranslation={selectedTranslation} translations={availableTranslations} />
            </div>
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
              onClick={() => searchVerse()}
              disabled={isLoading || !searchInput.trim()}
            >
              {isLoading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>

          {/* Instructions Section - Moved into the left column */}
          <div className="instructions-section">
            <h3>How to search:</h3>
            <div className="instructions-grid">
              <div><strong>Book Chapter:Verse</strong><br /><span>John 3:16, Romans 8:28</span></div>
              <div><strong>With numbers</strong><br /><span>1 Corinthians 13:4, 2 Timothy 3:16</span></div>
              <div><strong>Verse ranges</strong><br /><span>John 3:16-17, Psalm 23:1-3</span></div>
              <div><strong>Full chapters</strong><br /><span>Psalm 23, Romans 8</span></div>
            </div>
            <div className="instructions-tip">
              <strong>💡 Tip:</strong> Choose your preferred translation above. Memorized verses are saved to your profile.
            </div>
          </div>
        </div> {/* Fin de search-controls-column */}

        {/* Columna Derecha: Resultados de Búsqueda */}
        <div className="search-results-column">
          {/* Error Message */}
          {error && !isLoading && (
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
                Searching for verse in {getCurrentTranslation().fullName}...
              </p>
            </div>
          )}

          {/* Search Results */}
          {searchedVerse && !isLoading && !error && (
            <div className="verse-card">
              <div className="verse-card-header">
                <h3>{searchedVerse.verse_reference}</h3>
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

          {/* Example Verses - Show in right column if no verse, no loading, no error */}
          {!isLoading && !error && !searchedVerse && examplesByCategory.length > 0 && (
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
        </div> {/* Fin de search-results-column */}
      </div> {/* Fin de bible-search-layout-main */}

      {/* Updated Styles */}
      <style>{`
        .translation-selection-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .translation-selector {
          margin-bottom: 1rem;
        }
        
        .translation-selector label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #16223d;
        }
        
        .translation-dropdown {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 1rem;
          background-color: white;
          color: #495057;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        
        .translation-dropdown:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
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
          max-width: 400px;
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
        
        .verse-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .translation-used {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .translation-label {
          background-color: #ffc107;
          color: #16223d;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .translation-status {
          background-color: #28a745;
          color: white;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .translation-badge {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .translation-details {
            text-align: center;
          }
        }

        @media (min-width: 768px) {
          .translation-selection-section {
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            gap: var(--space-md, 1rem); 
          }

          .translation-selector {
            width: auto; 
            margin-bottom: 0; 
          }

          .translation-select {
            width: auto; 
            min-width: 280px; 
          }

          .search-input-group {
            max-width: 700px; 
            margin-left: auto; 
            margin-right: auto; 
          }
        }
      `}</style>
    </div>
  );
};

export default BibleSearch;