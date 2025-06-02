// src/services/bibleApi.ts
// Servicio para manejar múltiples traducciones bíblicas con NLT como predeterminada

export interface BibleTranslation {
  id: string;
  name: string;
  fullName: string;
  apiSource: 'bible-api' | 'bolls' | 'nlt-api';
  description: string;
}

export interface BibleApiVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: BibleApiVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
}

export interface SearchedVerse {
  id: number;
  verse_reference: string;
  text_nlt: string;
  context_nlt: string;
  translation: BibleTranslation;
}

class BibleApiService {
  
  // Traducciones disponibles ordenadas por popularidad
  private translations: BibleTranslation[] = [
    {
      id: 'nlt',
      name: 'NLT',
      fullName: 'New Living Translation',
      apiSource: 'bible-api',
      description: 'Easy to read, thought-for-thought translation'
    },
    {
      id: 'niv',
      name: 'NIV',
      fullName: 'New International Version',
      apiSource: 'bible-api',
      description: 'Balance between accuracy and readability'
    },
    {
      id: 'esv',
      name: 'ESV',
      fullName: 'English Standard Version',
      apiSource: 'bible-api',
      description: 'Word-for-word accuracy with modern English'
    },
    {
      id: 'kjv',
      name: 'KJV',
      fullName: 'King James Version',
      apiSource: 'bible-api',
      description: 'Classic translation with traditional language'
    },
    {
      id: 'nasb',
      name: 'NASB',
      fullName: 'New American Standard Bible',
      apiSource: 'bible-api',
      description: 'Highly literal and precise translation'
    }
  ];

  private defaultTranslation = 'nlt';

  /**
   * Obtiene todas las traducciones disponibles
   */
  getAvailableTranslations(): BibleTranslation[] {
    return this.translations;
  }

  /**
   * Obtiene la traducción predeterminada
   */
  getDefaultTranslation(): BibleTranslation {
    return this.translations.find(t => t.id === this.defaultTranslation) || this.translations[0];
  }

  /**
   * Busca un versículo usando la traducción especificada
   */
  async searchVerse(reference: string, translationId: string = this.defaultTranslation): Promise<SearchedVerse> {
    try {
      const translation = this.translations.find(t => t.id === translationId);
      if (!translation) {
        throw new Error(`Translation ${translationId} not found`);
      }

      const cleanedReference = this.cleanReference(reference);
      console.log(`Searching for verse: ${cleanedReference} in ${translation.name}`);
      
      let verseData: SearchedVerse;

      // Usar diferentes APIs según la traducción
      switch (translation.apiSource) {
        case 'bible-api':
          verseData = await this.searchWithBibleApi(cleanedReference, translation);
          break;
        default:
          verseData = await this.searchWithBibleApi(cleanedReference, translation);
      }

      return verseData;
      
    } catch (error) {
      console.error('Bible API Error:', error);
      
      if (error instanceof Error) {
        // Si falla la traducción preferida, intentar con bible-api.com (WEB) como fallback
        if (translationId !== 'web') {
          console.log('Attempting fallback to WEB translation...');
          return await this.searchWithFallback(reference);
        }
        
        // Errores específicos
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to Bible API. Please check your internet connection.');
        }
        
        throw error;
      }
      
      throw new Error('An unexpected error occurred while searching for the verse.');
    }
  }

  /**
   * Busca usando bible-api.com (soporta múltiples traducciones)
   */
  private async searchWithBibleApi(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // bible-api.com format: https://bible-api.com/john+3:16?translation=nlt
    const apiTranslationMap: { [key: string]: string } = {
      'nlt': 'nlt',
      'niv': 'niv',
      'esv': 'esv', 
      'kjv': 'kjv',
      'nasb': 'nasb'
    };

    const apiTranslation = apiTranslationMap[translation.id] || 'web';
    const url = `https://bible-api.com/${encodeURIComponent(reference)}${apiTranslation !== 'web' ? `?translation=${apiTranslation}` : ''}`;
    
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data: BibleApiResponse = await response.json();
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error('No verses found for this reference.');
    }

    if (!data.text || !data.reference) {
      throw new Error('Invalid response from Bible API.');
    }

    return this.transformApiResponse(data, translation);
  }

  /**
   * Fallback usando la API original (WEB translation)
   */
  private async searchWithFallback(reference: string): Promise<SearchedVerse> {
    const fallbackTranslation: BibleTranslation = {
      id: 'web',
      name: 'WEB',
      fullName: 'World English Bible',
      apiSource: 'bible-api',
      description: 'Free public domain translation'
    };

    const url = `https://bible-api.com/${encodeURIComponent(reference)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Verse not found. Please check your reference and try again.`);
    }

    const data: BibleApiResponse = await response.json();
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error('No verses found for this reference.');
    }

    return this.transformApiResponse(data, fallbackTranslation);
  }

  /**
   * Limpia y valida la referencia bíblica
   */
  private cleanReference(reference: string): string {
    const cleaned = reference.trim();
    
    if (!cleaned) {
      throw new Error('Please enter a Bible reference');
    }

    // Validaciones básicas
    const basicPattern = /^[\w\s]+\d+:\d+/;
    if (!basicPattern.test(cleaned)) {
      throw new Error('Invalid format. Please use format like "John 3:16" or "1 John 3:16"');
    }

    return cleaned;
  }

  /**
   * Transforma la respuesta de la API a nuestro formato
   */
private transformApiResponse(data: BibleApiResponse, translation: BibleTranslation): SearchedVerse {
  // IDs en rango específico para Bible Search (900,000 - 999,999)
  const bibleSearchId = 900000 + Math.floor(Math.random() * 99999);
  
  return {
    id: bibleSearchId, // ✅ ID en rango específico
    verse_reference: data.reference,
    text_nlt: data.text,
    context_nlt: `${translation.fullName} (${translation.name})`,
    translation: translation
  };
}

  /**
   * Obtiene ejemplos de referencias bíblicas por categoría
   */
  getExampleReferences(): { category: string; verses: string[] }[] {
    return [
      {
        category: 'Popular Verses',
        verses: ['John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Jeremiah 29:11']
      },
      {
        category: 'Comfort & Peace',
        verses: ['Psalm 23:1', 'Isaiah 41:10', 'Matthew 11:28', 'John 14:27']
      },
      {
        category: 'Faith & Trust',
        verses: ['Proverbs 3:5-6', 'Hebrews 11:1', 'Romans 10:17', '2 Corinthians 5:7']
      },
      {
        category: 'Love & Grace',
        verses: ['1 Corinthians 13:4', 'Ephesians 2:8-9', '1 John 4:8', 'Romans 5:8']
      }
    ];
  }

  /**
   * Valida si una referencia tiene el formato correcto
   */
  validateReference(reference: string): { isValid: boolean; message?: string } {
    const cleaned = reference.trim();
    
    if (!cleaned) {
      return { isValid: false, message: 'Please enter a Bible reference' };
    }

    if (cleaned.length < 3) {
      return { isValid: false, message: 'Reference too short' };
    }

    if (cleaned.length > 50) {
      return { isValid: false, message: 'Reference too long' };
    }

    // Patrones más específicos
    const patterns = [
      /^[\w\s]+\d+:\d+$/,           // "john 3:16"
      /^\d+\s+[\w\s]+\d+:\d+$/,     // "1 john 3:16"  
      /^[\w\s]+\d+:\d+-\d+$/,       // "john 3:16-17"
      /^[\w\s]+\d+$/,               // "psalm 23" (capítulo completo)
      /^\d+\s+[\w\s]+\d+:\d+-\d+$/, // "1 john 3:16-17"
    ];

    const isValid = patterns.some(pattern => pattern.test(cleaned.toLowerCase()));
    
    if (!isValid) {
      return { 
        isValid: false, 
        message: 'Please use format like "John 3:16", "1 John 3:16", or "John 3:16-17"' 
      };
    }

    return { isValid: true };
  }

  /**
   * Obtiene información sobre una traducción específica
   */
  getTranslationInfo(translationId: string): BibleTranslation | null {
    return this.translations.find(t => t.id === translationId) || null;
  }
}

// Exportar una instancia única
export const bibleApiService = new BibleApiService();
export default bibleApiService;