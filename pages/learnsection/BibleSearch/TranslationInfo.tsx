// TranslationInfo.tsx - Componente actualizado para múltiples traducciones
import React, { useState } from 'react';
import { BibleTranslation } from '../../../src/services/bibleApi';

interface TranslationInfoProps {
  translations: BibleTranslation[];
  selectedTranslation: string;
  isPremium?: boolean;
}

const TranslationInfo: React.FC<TranslationInfoProps> = ({ translations, selectedTranslation, isPremium = false }) => {
  const [showInfo, setShowInfo] = useState(false);

  const selectedTranslationData = translations.find(t => t.id === selectedTranslation);

  if (!selectedTranslationData) return null;

  return (
    <div className="translation-info-container">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="translation-info-toggle-btn"
        aria-label={`About ${selectedTranslationData?.name || 'selected translation'}`}
        aria-expanded={showInfo}
      >
        i
      </button>
      
      {showInfo && (
        <div className="translation-info-details-wrapper">
          {selectedTranslationData.premium && (
            <div style={{
              backgroundColor: '#ffc107',
              color: '#16223d',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              🔒 PREMIUM TRANSLATION {isPremium ? '- UNLOCKED' : ''}
            </div>
          )}
          <div className="translation-info-grid">
            <div>
              <strong>Full Name:</strong>
              <br />
              <span>{selectedTranslationData.fullName}</span>
            </div>
            
            <div>
              <strong>Reading Level:</strong>
              <br />
              <span>{selectedTranslationData.readingLevel}</span>
            </div>
            
            <div>
              <strong>First Published:</strong>
              <br />
              <span>{selectedTranslationData.year}</span>
            </div>
          </div>
          
          <div className="translation-info-section">
            <div className="translation-info-subsection">
              <strong>Translation Approach:</strong>
              <br />
              <span>{selectedTranslationData.approach}</span>
            </div>
            
            <div className="translation-info-subsection">
              <strong>Best For:</strong>
              <br />
              <span>{selectedTranslationData.bestFor}</span>
            </div>
            
            <div className="translation-info-description-box">
              <strong>Description:</strong> {selectedTranslationData.description}
            </div>

            <div className="translation-info-subsection">
              <strong>Key Features:</strong>
              <ul className="translation-info-features-list">
                {selectedTranslationData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Información específica por traducción */}
          {selectedTranslation === 'kjv' && (
            <div className="translation-info-specific-note kjv-note">
              <strong>Why KJV for Memorization:</strong> The poetic language and consistent rhythm make verses easier to memorize and remember.
            </div>
          )}
          
          {selectedTranslation === 'web' && (
            <div className="translation-info-specific-note web-note">
              <strong>Perfect for Modern Readers:</strong> No archaic language barriers - focus on understanding God's Word without translation confusion.
            </div>
          )}
          
          {selectedTranslation === 'asv' && (
            <div className="translation-info-specific-note asv-note">
              <strong>Scholar's Choice:</strong> Extremely literal translation preferred by seminaries and serious Bible students for detailed study.
            </div>
          )}

          <div className="translation-info-powered-by">
            <strong>Powered by bible-api.com:</strong> Free, reliable access to multiple Bible translations
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationInfo;