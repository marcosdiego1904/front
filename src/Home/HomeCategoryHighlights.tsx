import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming bibleApiService is correctly set up and can be imported
import bibleApiService, { SearchedVerse } from '../services/bibleApi'; 
import './HomeCategoryHighlights.css';
interface VerseToLearn {
  id: number; // Or string, depending on what your /learn page expects
  text_nlt: string;
  verse_reference: string;
  context_nlt: string; 
}

interface CategoryHighlight {
  name: string;
  exampleReferences: string[]; // Array of verse references like "John 3:16"
  description?: string; // Optional: A short description for the category
  // imagePath?: string; // Removed as per new direction
}

// Hardcoded categories with example verse references
const PREDEFINED_CATEGORIES: CategoryHighlight[] = [
  {
    name: "Faith & Trust",
    exampleReferences: ["Proverbs 3:5-6", "Hebrews 11:1", "Mark 11:24"],
    description: "Verses to strengthen your belief and reliance on God."
  },
  {
    name: "Love & Relationships",
    exampleReferences: ["1 Corinthians 13:4-7", "John 15:12-13", "Ephesians 4:32"],
    description: "Guidance on love, kindness, and healthy connections."
  },
  {
    name: "Strength & Encouragement",
    exampleReferences: ["Philippians 4:13", "Isaiah 41:10", "Joshua 1:9"],
    description: "Find power and motivation through God's word."
  },
  {
    name: "Peace & Comfort",
    exampleReferences: ["John 14:27", "Philippians 4:6-7", "Psalm 23:4"],
    description: "Scriptures to bring tranquility and solace to your heart."
  },
  {
    name: "Hope & Salvation",
    exampleReferences: ["Romans 15:13", "Jeremiah 29:11", "John 3:16"],
    description: "Discover the promise of hope and eternal life."
  },
  // Add more categories and references as desired
];

const HomeCategoryHighlights: React.FC = () => {
  const navigate = useNavigate();

  // State for the main search bar
  const [mainSearchInput, setMainSearchInput] = useState('');
  const [mainSearchedVerse, setMainSearchedVerse] = useState<SearchedVerse | null>(null);
  const [isMainSearching, setIsMainSearching] = useState(false);
  const [mainSearchError, setMainSearchError] = useState<string | null>(null);

  // State for fetching details when clicking an example reference
  const [fetchingExampleVerseDetailsRef, setFetchingExampleVerseDetailsRef] = useState<string | null>(null);
  const [exampleVerseFetchError, setExampleVerseFetchError] = useState<string | null>(null);

  // State for the new Interactive Topic Explorer
  const [activeCategoryName, setActiveCategoryName] = useState<string>(PREDEFINED_CATEGORIES[0]?.name || '');

  const handleMainSearch = async () => {
    const validation = bibleApiService.validateReference(mainSearchInput);
    if (!validation.isValid) {
      setMainSearchError(validation.message || "Invalid format. Try 'John 3:16' or 'Gen 1:1'.");
      setMainSearchedVerse(null);
      return;
    }

    setIsMainSearching(true);
    setMainSearchError(null);
    setMainSearchedVerse(null); // Clear previous main search results
    setExampleVerseFetchError(null); // Clear errors from example clicks

    try {
      const verse = await bibleApiService.searchVerse(mainSearchInput);
      setMainSearchedVerse(verse);
    } catch (err) {
      console.error(`Error during main search for ${mainSearchInput}:`, err);
      setMainSearchError(err instanceof Error ? err.message : "Couldn't find that verse. Please check the reference or try again.");
      setMainSearchedVerse(null);
    } finally {
      setIsMainSearching(false);
    }
  };

  const handleLearnVerse = (verse: SearchedVerse | VerseToLearn) => {
    // Normalize to VerseToLearn if it's a SearchedVerse
    const verseToLearnData: VerseToLearn = {
      id: verse.id,
      text_nlt: verse.text_nlt,
      verse_reference: verse.verse_reference,
      context_nlt: verse.context_nlt,
    };
    navigate('/learn', { state: { selectedVerse: verseToLearnData } });
  };

  const handleExampleVerseReferenceClick = async (verseReference: string) => {
    setFetchingExampleVerseDetailsRef(verseReference);
    setExampleVerseFetchError(null);
    setMainSearchedVerse(null); // Clear main search result when an example is clicked
    setMainSearchError(null);

    try {
      const verseData = await bibleApiService.searchVerse(verseReference);
      if (verseData) {
        handleLearnVerse(verseData); // Navigate to learn page
      } else {
        throw new Error("Verse not found or API error.");
      }
    } catch (err) {
      console.error(`Error fetching details for example ${verseReference}:`, err);
      setExampleVerseFetchError(`Error loading ${verseReference}. Please try again.`);
    } finally {
      setFetchingExampleVerseDetailsRef(null);
    }
  };

  const handleViewAllClick = (categoryName: string) => {
    navigate(`/biblesearch?category=${encodeURIComponent(categoryName)}`);
  };
  
  const clearMainSearch = () => {
    setMainSearchInput('');
    setMainSearchedVerse(null);
    setMainSearchError(null);
  };

  const activeCategoryData = PREDEFINED_CATEGORIES.find(cat => cat.name === activeCategoryName);

  return (
    <div className="home-category-highlights-section">
      {/* New Section Intro */}
      <div className="hch-section-intro">
        <h2>Find Your Verse</h2>
        <p>Enter a Bible reference (e.g., John 3:16) to jump directly to a passage, or explore curated topics to discover inspirational scriptures for your daily life.</p>
      </div>

      {/* Main Search Bar - Updated to match BibleSearch design (from global-design-system.css) */}
      <div className="search-input-group"> 
        <input
          type="text"
          className="search-input-field" 
          placeholder="Enter Bible reference (e.g., John 3:16)" 
          value={mainSearchInput}
          onChange={(e) => setMainSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMainSearch()}
          disabled={isMainSearching}
        />
        <button
          className="search-button" 
          onClick={handleMainSearch}
          disabled={isMainSearching || !mainSearchInput.trim()}
        >
          {isMainSearching ? 'Searching...' : '🔍 Search'}
        </button>
      </div>
      {mainSearchError && <p className="hch-error-message main-search-error">{mainSearchError}</p>}

      {/* Display Main Searched Verse */} 
      {mainSearchedVerse && (
        <div className="hch-main-searched-verse-display">
          <h3>{mainSearchedVerse.verse_reference}</h3>
          {mainSearchedVerse.context_nlt && <p className="hch-context"><em>{mainSearchedVerse.context_nlt}</em></p>}
          <p className="hch-verse-text">"{mainSearchedVerse.text_nlt}"</p>
          <div className="hch-main-searched-actions">
            <button onClick={() => handleLearnVerse(mainSearchedVerse)} className="hch-learn-btn">Memorize This Verse</button>
            <button onClick={clearMainSearch} className="hch-clear-search-btn">Clear & Explore Topics</button>
          </div>
        </div>
      )}

      {/* Display Category Highlights if no main verse is being shown */} 
      {!mainSearchedVerse && (
        <div className="hch-topic-explorer">
          <div className="hch-intro-text">
            <h2>Explore Bible Verses by Topic</h2>
            <p>Browse by category to find inspiration and guidance for every situation.</p>
          </div>

          <div className="hch-category-selector-list">
            {PREDEFINED_CATEGORIES.map((category) => (
              <button 
                key={category.name}
                className={`hch-category-selector ${activeCategoryName === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategoryName(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {activeCategoryData && (
            <div className="hch-active-category-content">
              {activeCategoryData.description && <p className="hch-category-description">{activeCategoryData.description}</p>}
              <div className="hch-example-verses-grid"> {/* Changed from hch-verses-list for potentially different styling */}
                {activeCategoryData.exampleReferences.length === 0 && (
                    <p className="hch-no-verses-message">More verses coming soon for {activeCategoryData.name}!</p>
                )}
                {activeCategoryData.exampleReferences.map((reference) => (
                  <button 
                    key={reference} 
                    className="hch-example-verse-link" // New class for styling verse refs as links/minimal chips
                    onClick={() => handleExampleVerseReferenceClick(reference)}
                    disabled={fetchingExampleVerseDetailsRef === reference}
                  >
                    {fetchingExampleVerseDetailsRef === reference ? 'Loading...' : reference}
                  </button>
                ))}
              </div>
              {exampleVerseFetchError && <p className="hch-error-message example-fetch-error">{exampleVerseFetchError}</p>}
             {/**
              * <button 
                className="hch-view-all-btn topic-view-all"
                onClick={() => handleViewAllClick(activeCategoryData.name)}
              >
                View All in {activeCategoryData.name}
              </button>
              */} 
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeCategoryHighlights; 