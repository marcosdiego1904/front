// src/services/bibleApi.ts
// Servicio corregido para manejar múltiples traducciones bíblicas

export interface BibleTranslation {
  id: string;
  name: string;
  fullName: string;
  apiSource: 'bible-api' | 'api-bible' | 'bolls';
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
  
  // Traducciones disponibles con fuentes específicas
  private translations: BibleTranslation[] = [
    {
      id: 'nlt',
      name: 'NLT',
      fullName: 'New Living Translation',
      apiSource: 'api-bible',
      description: 'Easy to read, thought-for-thought translation'
    },
    {
      id: 'niv',
      name: 'NIV',
      fullName: 'New International Version',
      apiSource: 'api-bible',
      description: 'Balance between accuracy and readability'
    },
    {
      id: 'esv',
      name: 'ESV',
      fullName: 'English Standard Version',
      apiSource: 'api-bible',
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
      id: 'web',
      name: 'WEB',
      fullName: 'World English Bible',
      apiSource: 'bible-api',
      description: 'Free public domain translation'
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
      console.log(`🔍 Searching for verse: ${cleanedReference} in ${translation.name} (${translation.id})`);
      
      let verseData: SearchedVerse;

      // Usar diferentes APIs según la traducción
      switch (translation.apiSource) {
        case 'api-bible':
          verseData = await this.searchWithApiBible(cleanedReference, translation);
          break;
        case 'bolls':
          verseData = await this.searchWithBolls(cleanedReference, translation);
          break;
        case 'bible-api':
        default:
          verseData = await this.searchWithBibleApi(cleanedReference, translation);
          break;
      }

      console.log(`✅ Found verse in ${translation.name}:`, verseData.text_nlt.substring(0, 50) + '...');
      return verseData;
      
    } catch (error) {
      console.error('Bible API Error:', error);
      
      if (error instanceof Error) {
        // Si falla la traducción preferida, intentar con fallback
        if (translationId !== 'web') {
          console.log('⚠️ Attempting fallback to WEB translation...');
          return await this.searchWithFallback(reference);
        }
        
        // Errores específicos
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to Bible API. Please check your internet connection.');
        }
        
        throw error;
      }
      
      throw new Error('An unexpected error occurred while searching for the verse.');
    }
  }

  /**
   * Busca usando api.bible (soporta NLT, NIV, ESV y más traducciones comerciales)
   */
  private async searchWithApiBible(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // Para simular api.bible (que requiere API key), usaremos bolls.life que es gratuito
    return await this.searchWithBolls(reference, translation);
  }

  /**
   * Busca usando bolls.life API (gratuito, soporta múltiples traducciones)
   */
  private async searchWithBolls(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // bolls.life format: https://bolls.life/get-text/ESV/John/3/16/
    
    const translationMapping: { [key: string]: string } = {
      'nlt': 'NLT',
      'niv': 'NIV', 
      'esv': 'ESV',
      'kjv': 'KJV',
      'web': 'WEB'
    };

    const apiTranslation = translationMapping[translation.id] || 'NLT';
    
    // Parse reference (ej: "John 3:16" -> book: John, chapter: 3, verse: 16)
    const parsedRef = this.parseReference(reference);
    if (!parsedRef) {
      throw new Error('Invalid reference format');
    }

    const url = `https://bolls.life/get-text/${apiTranslation}/${parsedRef.book}/${parsedRef.chapter}/${parsedRef.verse}/`;
    
    console.log('🌐 Bolls API URL:', url);
    
    try {
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

      const data = await response.json();
      
      if (!data || !data.text) {
        throw new Error('No verse text found in response.');
      }

      const bibleSearchId = 900000 + Math.floor(Math.random() * 99999);
      
      return {
        id: bibleSearchId,
        verse_reference: reference,
        text_nlt: data.text.trim(),
        context_nlt: `${translation.fullName} (${translation.name})`,
        translation: translation
      };

    } catch (fetchError) {
      console.log('⚠️ Bolls API failed, trying bible-api as fallback...');
      return await this.searchWithBibleApi(reference, translation);
    }
  }

  /**
   * Busca usando bible-api.com (fallback, limitado pero funcional)
   */
  private async searchWithBibleApi(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // bible-api.com solo soporta algunas traducciones
    const supportedTranslations: { [key: string]: string } = {
      'kjv': 'kjv',
      'web': '', // default
      'nlt': 'nlt', // Limitado
      'niv': 'niv', // Limitado
      'esv': 'esv'  // Limitado
    };

    const apiParam = supportedTranslations[translation.id];
    
    // Si la traducción no está soportada, usar WEB como fallback
    if (apiParam === undefined) {
      console.log(`⚠️ Translation ${translation.id} not supported by bible-api.com, using WEB...`);
      const webTranslation = this.translations.find(t => t.id === 'web');
      if (webTranslation) {
        translation = webTranslation;
      }
    }

    const url = apiParam && apiParam !== '' 
      ? `https://bible-api.com/${encodeURIComponent(reference)}?translation=${apiParam}`
      : `https://bible-api.com/${encodeURIComponent(reference)}`;
    
    console.log('🌐 Bible-API URL:', url);
    
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
   * Parsea una referencia bíblica en sus componentes
   */
  private parseReference(reference: string): { book: string; chapter: number; verse: number } | null {
    try {
      // Manejar casos como "1 John 3:16", "John 3:16", etc.
      const cleanRef = reference.trim();
      
      // Patrón para capturar libro, capítulo y versículo
      const match = cleanRef.match(/^(\d*\s*\w+)\s*(\d+):(\d+)/i);
      
      if (!match) {
        return null;
      }

      const [, bookPart, chapterStr, verseStr] = match;
      const book = bookPart.trim().replace(/\s+/g, '');
      const chapter = parseInt(chapterStr, 10);
      const verse = parseInt(verseStr, 10);

      if (isNaN(chapter) || isNaN(verse)) {
        return null;
      }

      return { book, chapter, verse };
    } catch (error) {
      console.error('Error parsing reference:', error);
      return null;
    }
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
      description: 'Free public domain translation (fallback)'
    };

    const url = `https://bible-api.com/${encodeURIComponent(reference)}`;
    
    console.log('🔄 Fallback URL:', url);
    
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