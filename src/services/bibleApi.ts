// src/services/bibleApi.ts
// bible-api.com implementation with KJV, WEB, and ASV

export interface BibleTranslation {
  id: string;
  name: string;
  fullName: string;
  apiSource: 'bible-api';
  description: string;
  readingLevel: string;
  approach: string;
  bestFor: string;
  year: string;
  features: string[];
}

export interface BibleApiResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note?: string;
}

export interface SearchedVerse {
  id: number;
  verse_reference: string;
  text_nlt: string;
  context_nlt: string;
  translation: BibleTranslation;
}

class BibleApiService {
  
  // ✅ Base URL for bible-api.com
  private readonly BASE_URL = 'https://bible-api.com';

  // ✅ Multiple translations available (con identificadores corregidos)
  private translations: BibleTranslation[] = [
    {
      id: 'kjv',
      name: 'KJV',
      fullName: 'King James Version',
      apiSource: 'bible-api',
      description: 'The classic King James Version from 1611, featuring traditional English and time-tested language.',
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
    },
    {
      id: 'web',
      name: 'WEB',
      fullName: 'World English Bible',
      apiSource: 'bible-api',
      description: 'A modern, easy-to-read translation that maintains accuracy while using contemporary English.',
      readingLevel: 'Grade 8-10 (Intermediate)',
      approach: 'Formal equivalence with modern language',
      bestFor: 'Daily reading, new Christians, modern worship, general study',
      year: '2000 (ongoing updates)',
      features: [
        'Public domain - completely free to use',
        'Modern English that\'s easy to understand',
        'Accurate translation from original languages',
        'Great for new believers and casual reading',
        'No copyright restrictions'
      ]
    },
    {
      id: 'asv',
      name: 'ASV',
      fullName: 'American Standard Version',
      apiSource: 'bible-api',
      description: 'A precise, scholarly translation known for its literal accuracy and attention to detail.',
      readingLevel: 'Grade 11-12 (Advanced)',
      approach: 'Formal equivalence (Very literal translation)',
      bestFor: 'Serious Bible study, theological research, comparison studies',
      year: '1901',
      features: [
        'Extremely literal and precise translation',
        'Preferred by Bible scholars and seminaries',
        'Excellent for cross-referencing and word studies',
        'Foundation for many modern translations',
        'Maintains original text structure'
      ]
    }
  ];

  private defaultTranslation = 'kjv';

  /**
   * Obtiene todas las traducciones disponibles
   */
  getAvailableTranslations(): BibleTranslation[] {
    return this.translations;
  }

  /**
   * Obtiene la traducción predeterminada (KJV)
   */
  getDefaultTranslation(): BibleTranslation {
    return this.translations.find(t => t.id === this.defaultTranslation) || this.translations[0];
  }

  /**
   * Obtiene una traducción específica por ID
   */
  getTranslationById(translationId: string): BibleTranslation | null {
    return this.translations.find(t => t.id === translationId) || null;
  }

  /**
   * Busca un versículo usando bible-api.com
   */
  async searchVerse(reference: string, translationId: string = this.defaultTranslation): Promise<SearchedVerse> {
    try {
      const translation = this.translations.find(t => t.id === translationId) || this.translations[0];
      const cleanedReference = this.cleanReference(reference);
      
      console.log(`🔍 Searching for verse: ${cleanedReference} in ${translation.name}`);
      
      const verseData = await this.searchWithBibleApi(cleanedReference, translation);

      console.log(`✅ Found verse in ${translation.name}:`, verseData.text_nlt.substring(0, 50) + '...');
      return verseData;
      
    } catch (error) {
      console.error('Bible API Error:', error);
      
      if (error instanceof Error) {
        // Errores específicos
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (error.message.includes('404')) {
          throw new Error('Verse not found. Please check your reference format (e.g., "John 3:16").');
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
   * Busca usando bible-api.com
   */
  private async searchWithBibleApi(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // bible-api.com acepta referencias como "john+3:16" o "john 3:16"
    const encodedReference = encodeURIComponent(reference);
    
    // Para WEB (World English Bible), la API usa 'web' pero si no especificas nada, usa WEB por defecto
    // Para ASV (American Standard Version), la API usa 'asv'  
    // Para KJV (King James Version), la API usa 'kjv'
    let apiTranslationParam = '';
    if (translation.id !== 'web') {
      // Solo agregamos parámetro si NO es WEB (que es el default)
      apiTranslationParam = `?translation=${translation.id}`;
    }
    
    const url = `${this.BASE_URL}/${encodedReference}${apiTranslationParam}`;
    
    console.log('🌐 Bible API URL:', url);
    console.log('🔍 Requested translation:', translation.name, `(${translation.id})`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data: BibleApiResponse = await response.json();
    
    console.log('📋 Bible API Response:', data);
    console.log('📖 Translation returned by API:', data.translation_name || 'Not specified');
    
    if (!data.text && (!data.verses || data.verses.length === 0)) {
      throw new Error('No verse found for this reference. Please check the format.');
    }

    return this.transformBibleApiResponse(data, translation);
  }

  /**
   * Transforma la respuesta de bible-api.com a nuestro formato
   */
  private transformBibleApiResponse(data: BibleApiResponse, translation: BibleTranslation): SearchedVerse {
    const bibleSearchId = 800000 + Math.floor(Math.random() * 99999);
    
    // Usar el texto principal o concatenar versículos individuales
    let verseText = data.text;
    let verseReference = data.reference;
    
    // Si no hay texto principal, construir desde versículos individuales
    if (!verseText && data.verses && data.verses.length > 0) {
      verseText = data.verses.map(v => v.text).join(' ');
      
      // Construir referencia si no está disponible
      if (!verseReference && data.verses.length > 0) {
        const firstVerse = data.verses[0];
        const lastVerse = data.verses[data.verses.length - 1];
        
        if (data.verses.length === 1) {
          verseReference = `${firstVerse.book_name} ${firstVerse.chapter}:${firstVerse.verse}`;
        } else if (firstVerse.chapter === lastVerse.chapter) {
          verseReference = `${firstVerse.book_name} ${firstVerse.chapter}:${firstVerse.verse}-${lastVerse.verse}`;
        } else {
          verseReference = `${firstVerse.book_name} ${firstVerse.chapter}:${firstVerse.verse} - ${lastVerse.chapter}:${lastVerse.verse}`;
        }
      }
    }

    // Construir contexto informativo con información de la API
    let contextInfo = `${translation.fullName}`;
    
    // Agregar información de la traducción real devuelta por la API si está disponible
    if (data.translation_name && data.translation_name !== translation.fullName) {
      contextInfo += ` (API returned: ${data.translation_name})`;
    }
    
    if (data.verses && data.verses.length > 0) {
      const book = data.verses[0].book_name;
      contextInfo += ` - Book: ${book}`;
      
      if (data.verses.length > 1) {
        contextInfo += ` (${data.verses.length} verses)`;
      }
    }
    
    return {
      id: bibleSearchId,
      verse_reference: verseReference || 'Unknown Reference',
      text_nlt: verseText || 'No text available',
      context_nlt: contextInfo,
      translation: translation
    };
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

    // Patrones más específicos para bible-api.com
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

  /**
   * Método debug para ver todas las traducciones disponibles
   */
  async debugGetAllBibles() {
    console.log('🔍 Available translations:', this.translations.map(t => `${t.name} (${t.id})`));
    console.log('📖 API Source: bible-api.com');
    return this.translations;
  }
}

// Exportar una instancia única
export const bibleApiService = new BibleApiService();
export default bibleApiService;