import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleApiService, { SearchedVerse } from '../../../src/services/bibleApi';
import TranslationInfo from './TranslationInfo';
import { useAuth } from '../../../src/auth/context/AuthContext';
import { getSubscriptionStatus } from '../../../src/services/stripeApi';

const BibleSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedVerse, setSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonVerses, setComparisonVerses] = useState<SearchedVerse[]>([]);
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Check premium status on mount
  React.useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user && token) {
        try {
          const status = await getSubscriptionStatus(token);
          setIsPremium(status.hasSubscription);
        } catch (err) {
          console.error('Failed to check premium status:', err);
          setIsPremium(user.isPremium || false);
        }
      } else {
        setIsPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user, token]);

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
    console.log('🔍 Searching with translation:', translationToUse, '(Premium:', isPremium, ')');

    try {
      const verse = await bibleApiService.searchVerse(searchInput, translationToUse, isPremium);
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
    const translation = availableTranslations.find(t => t.id === translationId);

    // Check if translation is premium and user is not premium
    if (translation?.premium && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }

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
          const verse = await bibleApiService.searchVerse(searchInput, translationId, isPremium);
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

  const copyToClipboard = async () => {
    if (!searchedVerse) return;

    const currentTranslation = getCurrentTranslation();
    const textToCopy = `"${searchedVerse.text_nlt}" - ${searchedVerse.verse_reference} (${currentTranslation.name})`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const compareTranslations = async () => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setComparisonVerses([]);

    try {
      // Fetch all accessible translations in parallel (free + premium if user has access)
      const accessibleTranslations = availableTranslations.filter(t => !t.premium || isPremium);
      const promises = accessibleTranslations.map(translation =>
        bibleApiService.searchVerse(searchInput, translation.id, isPremium)
      );

      const results = await Promise.all(promises);
      setComparisonVerses(results);
      setShowComparison(true);
      setSearchedVerse(null); // Hide single verse view
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare translations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bible-search-container">
      {/* Main Search Section - Centered */}
      <div className="search-main-section">
        <div className="search-header">
          <h1>Bible Search</h1>
          <p>Search for any Bible verse and start memorizing instantly</p>
        </div>

        {/* Search Input - Main focus */}
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input-field"
              placeholder="Enter Bible reference (e.g., John 3:16)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            className="search-button"
            onClick={() => searchVerse()}
            disabled={isLoading || !searchInput.trim()}
          >
            {isLoading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Translation Selection - Compact inline */}
        <div className="translation-selection-inline">
          <div className="translation-selector-wrapper">
            <select
              id="translation-select"
              value={selectedTranslation}
              onChange={(e) => handleTranslationChange(e.target.value)}
              className="translation-select-compact"
            >
              {availableTranslations.map((translation) => (
                <option key={translation.id} value={translation.id}>
                  {translation.name} - {translation.fullName} {translation.premium ? '🔒 PRO' : ''}
                </option>
              ))}
            </select>
            <TranslationInfo selectedTranslation={selectedTranslation} translations={availableTranslations} isPremium={isPremium} />
          </div>
        </div>

        {/* Results Section */}
        <div className="search-results-section">
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
        {searchedVerse && !isLoading && !error && !showComparison && (
            <div className="verse-card">
              <div className="verse-card-header">
                <h3>{searchedVerse.verse_reference}</h3>
                {copySuccess && (
                  <span className="copy-success-message">✓ Copied!</span>
                )}
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
                  onClick={compareTranslations}
                >
                  🔄 Compare Translations
                </button>
                <button
                  className="action-button secondary-action"
                  onClick={copyToClipboard}
                >
                  📋 Copy Verse
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

          {/* Translation Comparison View */}
          {showComparison && comparisonVerses.length > 0 && !isLoading && !error && (
            <div className="comparison-container">
              <div className="comparison-header">
                <h3>Translation Comparison</h3>
                <button
                  className="back-button"
                  onClick={() => {
                    setShowComparison(false);
                    setComparisonVerses([]);
                  }}
                >
                  ← Back to Single View
                </button>
              </div>
              <div className="comparison-grid">
                {comparisonVerses.map((verse, index) => (
                  <div key={index} className="comparison-card">
                    <div className="comparison-card-header">
                      <h4>{verse.translation.name}</h4>
                      <span className="translation-full-name">{verse.translation.fullName}</span>
                    </div>
                    <div className="comparison-card-content">
                      <p className="comparison-reference">{verse.verse_reference}</p>
                      <p className="comparison-text">"{verse.text_nlt}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Topic Cards Section - Below search */}
      {!isLoading && !error && !searchedVerse && !showComparison && examplesByCategory.length > 0 && (
        <div className="topics-section">
          <h3 className="examples-main-title">Explore Verses by Topic</h3>
          <p className="examples-subtitle">Click any verse to search and start memorizing</p>
          <div className="topics-grid">
            {examplesByCategory.map((category, index) => (
              <div key={index} className="topic-card">
                <div className="topic-header">
                  <span className="topic-emoji">{category.emoji}</span>
                  <h4 className="topic-title">{category.category}</h4>
                </div>
                <p className="topic-description">{category.description}</p>
                <div className="topic-verses">
                  {category.verses.map((verse) => (
                    <button
                      key={verse}
                      className="verse-button"
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
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="upgrade-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <button className="upgrade-modal-close" onClick={() => setShowUpgradeModal(false)}>×</button>
            <div className="upgrade-modal-icon">🔒</div>
            <h2 className="upgrade-modal-title">Unlock Premium Translations</h2>
            <p className="upgrade-modal-description">
              NIV and NLT are premium translations available exclusively to Pro members.
            </p>
            <div className="upgrade-modal-benefits">
              <div className="upgrade-benefit">✓ NIV - World's most popular modern translation</div>
              <div className="upgrade-benefit">✓ NLT - Crystal-clear contemporary English</div>
              <div className="upgrade-benefit">✓ Unlimited verses</div>
              <div className="upgrade-benefit">✓ All 10 ranks unlocked</div>
              <div className="upgrade-benefit">✓ Advanced analytics</div>
            </div>
            <button
              className="upgrade-modal-cta"
              onClick={() => navigate('/subscriptions')}
            >
              Upgrade to Pro - $9.99/mo
            </button>
            <p className="upgrade-modal-footer">30-day money-back guarantee • Cancel anytime</p>
          </div>
        </div>
      )}

      {/* Updated Styles */}
      <style>{`
        .bible-search-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .search-main-section {
          max-width: 800px;
          margin: 0 auto 4rem auto;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 20px;
          padding: 2.5rem 2rem 2rem 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.1);
        }

        .search-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .search-header h1 {
          font-size: 2.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #16223d 0%, #2C3E50 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .search-header p {
          font-size: 1.125rem;
          color: #6c757d;
          font-weight: 400;
        }

        .search-results-section {
          margin-top: 2rem;
        }

        .topics-section {
          width: 100%;
          padding: 2rem 0;
        }

        .translation-selection-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .translation-selector-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .translation-info-container {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .translation-select-compact {
          padding: 0.5rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.9rem;
          background-color: white;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .translation-select-compact:hover {
          border-color: #ffc107;
        }

        .translation-select-compact:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .translation-info-toggle-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #6c757d;
          background-color: white;
          color: #6c757d;
          font-weight: bold;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .translation-info-toggle-btn:hover {
          border-color: #ffc107;
          color: #ffc107;
          background-color: #fffbf0;
        }

        .translation-info-details-wrapper {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          max-width: 90vw;
          background: white;
          border: 2px solid #ffc107;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          z-index: 1100;
          max-height: 70vh;
          overflow-y: auto;
        }

        .translation-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .translation-info-section {
          font-size: 0.9rem;
        }

        .translation-info-subsection {
          margin-bottom: 1rem;
        }

        .translation-info-subsection strong {
          color: #16223d;
        }

        .translation-info-description-box {
          background-color: #f8f9fa;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .translation-info-features-list {
          margin: 0.5rem 0 0 1.25rem;
          padding: 0;
          font-size: 0.85rem;
        }

        .translation-info-features-list li {
          margin-bottom: 0.25rem;
        }

        .translation-info-specific-note {
          background-color: #e7f3ff;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-size: 0.85rem;
        }

        .translation-info-powered-by {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
          font-size: 0.8rem;
          color: #6c757d;
          text-align: center;
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

        .search-input-group {
          display: flex;
          align-items: stretch;
          background-color: white;
          border: 3px solid #ffc107;
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(255, 193, 7, 0.2);
          transition: all 0.3s ease;
        }

        .search-input-group:focus-within {
          box-shadow: 0 6px 28px rgba(255, 193, 7, 0.35);
          transform: translateY(-2px);
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-input-field {
          flex: 1;
          padding: 1.125rem 1.5rem;
          border: none;
          font-size: 1.125rem;
          background-color: transparent;
          color: #16223d;
        }

        .search-input-field:focus {
          outline: none;
        }

        .search-input-field::placeholder {
          color: #adb5bd;
        }

        .search-button {
          padding: 1.125rem 2.5rem;
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          color: #16223d;
          border: none;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          border-left: 2px solid rgba(255, 193, 7, 0.3);
        }

        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
        }

        .search-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .search-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .search-main-section {
            padding: 2rem 1.5rem;
          }

          .search-header h1 {
            font-size: 2rem;
          }

          .search-header p {
            font-size: 1rem;
          }

          .search-input-group {
            flex-direction: column;
            border-radius: 16px;
          }

          .search-button {
            width: 100%;
            padding: 1rem;
            border-left: none;
            border-top: 2px solid rgba(255, 193, 7, 0.3);
          }

          .search-input-field {
            font-size: 1rem;
            padding: 1rem 1.25rem;
          }

          .translation-selection-inline {
            flex-direction: column;
            gap: 0.5rem;
          }

          .translation-select-compact {
            width: 100%;
            text-align: center;
          }
        }

        .copy-success-message {
          display: inline-block;
          margin-left: 1rem;
          padding: 0.25rem 0.75rem;
          background-color: #28a745;
          color: white;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 600;
          animation: fadeInOut 2s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-5px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }

        .comparison-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .comparison-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #16223d;
          margin: 0;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .back-button:hover {
          background-color: #5a6268;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .comparison-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .comparison-card {
          background-color: white;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .comparison-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .comparison-card-header {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #ffc107;
        }

        .comparison-card-header h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #16223d;
          margin: 0 0 0.25rem 0;
        }

        .translation-full-name {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }

        .comparison-card-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comparison-reference {
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }

        .comparison-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #212529;
          margin: 0;
        }

        .examples-main-title {
          font-size: 2rem;
          font-weight: 700;
          color: #16223d;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .examples-subtitle {
          font-size: 1.125rem;
          color: #6c757d;
          text-align: center;
          margin-bottom: 3rem;
        }

        .topics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .topics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .topics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .topic-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #e9ecef;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .topic-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          border-color: #ffc107;
        }

        .topic-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .topic-emoji {
          font-size: 2rem;
          line-height: 1;
        }

        .topic-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #16223d;
          margin: 0;
        }

        .topic-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .topic-verses {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .verse-button {
          padding: 0.5rem 1rem;
          background-color: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .verse-button:hover {
          background-color: #ffc107;
          border-color: #ffc107;
          color: #16223d;
          transform: scale(1.05);
        }

        .verse-button:active {
          transform: scale(0.98);
        }

        .verse-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-help-wrapper {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          padding-right: 12px;
          z-index: 100;
        }

        .search-help-icon {
          position: relative;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          opacity: 0.6;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .search-help-icon:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .search-help-icon:active {
          transform: scale(0.95);
        }

        .search-help-tooltip {
          position: absolute;
          top: calc(100% + 12px);
          right: -12px;
          width: 320px;
          background-color: white;
          border: 2px solid #ffc107;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 1200;
          animation: tooltipFadeIn 0.2s ease-out;
          pointer-events: all;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .tooltip-section:last-child {
          margin-bottom: 0;
        }

        .tooltip-section strong {
          color: #16223d;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .tooltip-section span {
          color: #6c757d;
          font-size: 0.8rem;
        }

        /* Upgrade Modal Styles */
        .upgrade-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .upgrade-modal {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .upgrade-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          color: #6c757d;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .upgrade-modal-close:hover {
          background-color: #f8f9fa;
          color: #16223d;
        }

        .upgrade-modal-icon {
          font-size: 4rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .upgrade-modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #16223d;
          text-align: center;
          margin-bottom: 1rem;
          font-family: 'Lora', serif;
        }

        .upgrade-modal-description {
          text-align: center;
          color: #6c757d;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .upgrade-modal-benefits {
          background-color: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .upgrade-benefit {
          color: #16223d;
          font-size: 1rem;
          padding: 0.5rem 0;
          font-weight: 500;
        }

        .upgrade-benefit:not(:last-child) {
          border-bottom: 1px solid #e9ecef;
        }

        .upgrade-modal-cta {
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          color: #16223d;
          border: none;
          border-radius: 12px;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
        }

        .upgrade-modal-cta:hover {
          background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
          box-shadow: 0 6px 28px rgba(255, 193, 7, 0.4);
          transform: translateY(-2px);
        }

        .upgrade-modal-cta:active {
          transform: translateY(0);
        }

        .upgrade-modal-footer {
          text-align: center;
          color: #6c757d;
          font-size: 0.875rem;
          margin-top: 1rem;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .upgrade-modal {
            padding: 2rem 1.5rem;
          }

          .upgrade-modal-title {
            font-size: 1.5rem;
          }

          .upgrade-modal-description {
            font-size: 1rem;
          }

          .upgrade-modal-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BibleSearch;