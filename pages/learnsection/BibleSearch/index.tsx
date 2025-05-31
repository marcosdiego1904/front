import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleApiService, { SearchedVerse, BibleTranslation } from '../../../src/services/bibleApi';

const BibleSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id);
  const [searchedVerse, setSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtener traducciones y ejemplos disponibles
  const availableTranslations = bibleApiService.getAvailableTranslations();
  const examplesByCategory = bibleApiService.getExampleReferences();

  // Function to search verse using the improved service
  const searchVerse = async () => {
    // Validación básica
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
      console.log('Verse found:', verse);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search verse. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start learning the searched verse
  const startLearning = () => {
    if (searchedVerse) {
      console.log('Navigating to learn with verse:', searchedVerse);
      navigate('/learn', { 
        state: { 
          selectedVerse: searchedVerse 
        } 
      });
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchVerse();
    }
  };

  // Handle example click
  const handleExampleClick = (reference: string) => {
    setSearchInput(reference);
    setError(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', marginTop: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#16223d', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Bible Search
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Search for any Bible verse in your preferred translation and start memorizing instantly
        </p>
      </div>

      {/* Translation Selector */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: 'bold', 
          color: '#16223d' 
        }}>
          Choose Translation:
        </label>
        <select
          value={selectedTranslation}
          onChange={(e) => setSelectedTranslation(e.target.value)}
          disabled={isLoading}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#16223d',
            cursor: 'pointer',
            minWidth: '250px'
          }}
        >
          {availableTranslations.map((translation) => (
            <option key={translation.id} value={translation.id}>
              {translation.name} - {translation.fullName}
            </option>
          ))}
        </select>
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          {availableTranslations.find(t => t.id === selectedTranslation)?.description}
        </p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'white',
          border: '2px solid #ffc107',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            placeholder="Enter Bible reference (e.g., John 3:16, Romans 8:28)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '1.25rem 1.5rem',
              fontSize: '1.1rem',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent'
            }}
          />
          <button 
            onClick={searchVerse}
            disabled={isLoading || !searchInput.trim()}
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: isLoading ? '#ccc' : '#ffc107',
              color: '#16223d',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderLeft: '4px solid #f44336',
          borderRadius: '8px',
          color: '#d32f2f',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '2px solid #ffc107'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #ffc107',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#16223d', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Searching for verse in {availableTranslations.find(t => t.id === selectedTranslation)?.name}...
          </p>
        </div>
      )}

      {/* Search Results - MOVED UP */}
      {searchedVerse && !isLoading && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          marginBottom: '3rem',
          border: '3px solid #ffc107',
          animation: 'slideInFromTop 0.5s ease'
        }}>
          {/* Header with translation info */}
          <div style={{
            background: 'linear-gradient(135deg, #16223d 0%, #2a3a5c 100%)',
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#ffc107', 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.5rem 0' 
            }}>
              {searchedVerse.verse_reference}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
              {searchedVerse.context_nlt}
            </p>
          </div>
          
          {/* Verse content */}
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ 
              fontSize: '1.4rem', 
              fontStyle: 'italic', 
              lineHeight: '1.8',
              color: '#16223d',
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderLeft: '5px solid #ffc107',
              borderRadius: '8px',
              fontWeight: '500'
            }}>
              "{searchedVerse.text_nlt}"
            </p>
          </div>
          
          {/* Action buttons */}
          <div style={{ 
            padding: '2rem', 
            backgroundColor: '#f8f9fa',
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={startLearning}
              style={{
                padding: '1.25rem 2.5rem',
                backgroundColor: '#ffc107',
                color: '#16223d',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.3)';
              }}
            >
              📚 Learn This Verse
            </button>
            
            <button 
              onClick={() => {
                setSearchedVerse(null);
                setSearchInput('');
                setError(null);
              }}
              style={{
                padding: '1.25rem 2rem',
                backgroundColor: 'transparent',
                color: '#16223d',
                border: '2px solid #16223d',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#16223d';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#16223d';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔍 Search Another Verse
            </button>
          </div>
        </div>
      )}

      {/* Example Verses by Category - MOVED DOWN, ONLY SHOW WHEN NO VERSE FOUND */}
      {!searchedVerse && !isLoading && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ textAlign: 'center', color: '#16223d', marginBottom: '1.5rem' }}>
            Popular Verses to Try:
          </h3>
          {examplesByCategory.map((category, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ 
                color: '#ffc107', 
                fontSize: '1rem', 
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                {category.category}
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                justifyContent: 'center' 
              }}>
                {category.verses.map((verse) => (
                  <button
                    key={verse}
                    onClick={() => handleExampleClick(verse)}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      color: '#16223d',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#ffc107';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.color = '#16223d';
                      }
                    }}
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
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '15px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#16223d', textAlign: 'center', marginBottom: '1.5rem' }}>
          How to search:
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <strong style={{ color: '#ffc107' }}>Book Chapter:Verse</strong>
            <br />
            <span style={{ color: '#666' }}>John 3:16, Romans 8:28</span>
          </div>
          <div>
            <strong style={{ color: '#ffc107' }}>With numbers</strong>
            <br />
            <span style={{ color: '#666' }}>1 Corinthians 13:4, 2 Timothy 3:16</span>
          </div>
          <div>
            <strong style={{ color: '#ffc107' }}>Verse ranges</strong>
            <br />
            <span style={{ color: '#666' }}>John 3:16-17, Psalm 23:1-3</span>
          </div>
          <div>
            <strong style={{ color: '#ffc107' }}>Full chapters</strong>
            <br />
            <span style={{ color: '#666' }}>Psalm 23, Romans 8</span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.95rem', 
          color: '#666',
          textAlign: 'center'
        }}>
          <strong style={{ color: '#16223d' }}>💡 Tip:</strong> NLT (New Living Translation) is selected by default for easier reading. 
          All verses you memorize will be saved to your profile when you complete the 6-step learning process.
        </div>
      </div>

      {/* CSS Animation for spinner and slide in */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInFromTop {
          0% { 
            opacity: 0;
            transform: translateY(-30px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BibleSearch;