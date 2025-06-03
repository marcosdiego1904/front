// TranslationInfo.tsx - Componente actualizado para bible-api.com (KJV only)
import React, { useState } from 'react';
import { BibleTranslation } from '../../../src/services/bibleApi';
{/**Hacer que el componente se vea en la página de búsqueda de la Biblia */}
interface TranslationInfoProps {
  translations: BibleTranslation[];
  selectedTranslation: string;
}

const TranslationInfo: React.FC<TranslationInfoProps> = ({ translations, selectedTranslation }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const selectedTranslationData = translations.find(t => t.id === selectedTranslation);
  
  const getTranslationDetails = (id: string) => {
    // Solo información para KJV ya que es la única traducción disponible
    const details: { [key: string]: { readingLevel: string; approach: string; bestFor: string; year: string; features: string[] } } = {
      'kjv': {
        readingLevel: 'Grade 12+ (Advanced)',
        approach: 'Formal equivalence (Word-for-word translation)',
        bestFor: 'Traditional worship, literary study, memorization, theological study',
        year: '1611 (last major revision 1769)',
        features: [
          'Most widely memorized translation in history',
          'Beautiful, poetic language with theological precision',
          'Time-tested accuracy and reliability',
          'Rich vocabulary that enhances understanding',
          'Preferred by many churches and theologians'
        ]
      }
    };
    
    return details[id] || details['kjv']; // Fallback a KJV
  };

  if (!selectedTranslationData) return null;

  const details = getTranslationDetails(selectedTranslation);

  return (
    <div style={{ 
      margin: '1rem 0',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      <button
        onClick={() => setShowInfo(!showInfo)}
        style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto'
        }}
      >
        📖 About {selectedTranslationData.name} Translation 
        <span style={{ transform: showInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          ▼
        </span>
      </button>
      
      {showInfo && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '6px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong style={{ color: '#16223d' }}>Full Name:</strong>
              <br />
              <span style={{ color: '#666' }}>{selectedTranslationData.fullName}</span>
            </div>
            
            <div>
              <strong style={{ color: '#16223d' }}>Reading Level:</strong>
              <br />
              <span style={{ color: '#666' }}>{details.readingLevel}</span>
            </div>
            
            <div>
              <strong style={{ color: '#16223d' }}>First Published:</strong>
              <br />
              <span style={{ color: '#666' }}>{details.year}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#16223d' }}>Translation Approach:</strong>
              <br />
              <span style={{ color: '#666' }}>{details.approach}</span>
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#16223d' }}>Best For:</strong>
              <br />
              <span style={{ color: '#666' }}>{details.bestFor}</span>
            </div>
            
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#e7f3ff',
              borderLeft: '4px solid #007bff',
              borderRadius: '4px',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#0056b3' }}>Description:</strong> {selectedTranslationData.description}
            </div>

            {/* Nueva sección: Características especiales de KJV */}
            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#16223d' }}>Why Choose KJV for Memorization:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#666' }}>
                {details.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fff3cd',
            borderLeft: '4px solid #ffc107',
            borderRadius: '4px',
            fontSize: '0.85rem'
          }}>
            <strong style={{ color: '#856404' }}>Powered by bible-api.com:</strong> Free, reliable access to the timeless King James Version
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TranslationInfo;