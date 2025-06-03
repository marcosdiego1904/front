// TranslationInfo.tsx - Componente actualizado para API.Bible
import React, { useState } from 'react';
import { BibleTranslation } from '../../../src/services/bibleApi';

interface TranslationInfoProps {
  translations: BibleTranslation[];
  selectedTranslation: string;
}

const TranslationInfo: React.FC<TranslationInfoProps> = ({ translations, selectedTranslation }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const selectedTranslationData = translations.find(t => t.id === selectedTranslation);
  
  const getTranslationDetails = (id: string) => {
    // Mapeo actualizado para los IDs de API.Bible
    const details: { [key: string]: { readingLevel: string; approach: string; bestFor: string; year: string } } = {
      'de4e12af7f28f599-02': { // NLT
        readingLevel: 'Grade 6',
        approach: 'Thought-for-thought (Dynamic Equivalence)',
        bestFor: 'Daily reading, new believers, memorization',
        year: '1996 (revised 2004, 2007, 2015)'
      },
      '78a9f6124f344018-01': { // NIV
        readingLevel: 'Grade 7-8', 
        approach: 'Balance between word-for-word and thought-for-thought',
        bestFor: 'General study, most popular for memorization',
        year: '1978 (revised 2011)'
      },
      'de4e12af7f28f599-01': { // KJV
        readingLevel: 'Grade 12+',
        approach: 'Formal equivalence (Word-for-word)',
        bestFor: 'Traditional worship, classic literature feel',
        year: '1611 (last major revision 1769)'
      }
    };
    
    return details[id] || {
      readingLevel: 'N/A',
      approach: 'Mixed approach',
      bestFor: 'General use',
      year: 'Various'
    };
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
              fontSize: '0.9rem'
            }}>
              <strong style={{ color: '#0056b3' }}>Description:</strong> {selectedTranslationData.description}
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
            <strong style={{ color: '#856404' }}>Powered by API.Bible:</strong> High-quality translations from American Bible Society
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