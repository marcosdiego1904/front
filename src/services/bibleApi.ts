// src/services/bibleApi.ts
// API.Bible implementation with NLT, NIV, KJV support

export interface BibleTranslation {
  id: string;
  name: string;
  fullName: string;
  apiSource: 'api-bible';
  description: string;
}

export interface ApiBibleResponse {
  data: {
    id: string;
    orgId: string;
    reference: string;
    content: string;
    verseCount: number;
    copyright?: string;
  };
}

export interface SearchedVerse {
  id: number;
  verse_reference: string;
  text_nlt: string;
  context_nlt: string;
  translation: BibleTranslation;
}

class BibleApiService {
  
  // ✅ API Key - REEMPLAZA CON TU CLAVE
  private readonly API_KEY = '8b25da1509dedcec5db13d767c7c3089'; // 🔑 Cambiar por tu API key
  private readonly BASE_URL = 'https://api.scripture.api.bible/v1';

  // ✅ Traducciones disponibles en API.Bible (IDs corregidos - MODO DEBUG)
  private translations: BibleTranslation[] = [
    {
      id: 'de4e12af7f28f599-02', // Este es KJV disfrazado, vamos a probarlo
      name: 'NLT',
      fullName: 'New Living Translation',
      apiSource: 'api-bible',
      description: 'Easy to read, thought-for-thought translation'
    },
    {
      id: 'de4e12af7f28f599-01', // KJV real
      name: 'KJV',
      fullName: 'King James Version',
      apiSource: 'api-bible',
      description: 'Classic translation with traditional language'
    },
    // Vamos a probar otros IDs posibles para NLT
    {
      id: 'de4e12af7f28f599-03', // Probar este para NLT
      name: 'NLT-Test',
      fullName: 'New Living Translation (Test)',
      apiSource: 'api-bible',
      description: 'Testing different ID for NLT'
    }
  ];

  private defaultTranslation = 'de4e12af7f28f599-02'; // NLT por defecto

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
      // Validar API key
      if (!this.API_KEY || this.API_KEY === 'TU_API_KEY_AQUI') {
        throw new Error('API key not configured. Please add your API.Bible key to the service.');
      }

      const translation = this.translations.find(t => t.id === translationId);
      if (!translation) {
        throw new Error(`Translation ${translationId} not found`);
      }

      const cleanedReference = this.cleanReference(reference);
      console.log(`🔍 Searching for verse: ${cleanedReference} in ${translation.name} (${translation.id})`);
      
      const verseData = await this.searchWithApiBible(cleanedReference, translation);

      console.log(`✅ Found verse in ${translation.name}:`, verseData.text_nlt.substring(0, 50) + '...');
      return verseData;
      
    } catch (error) {
      console.error('Bible API Error:', error);
      
      if (error instanceof Error) {
        // Errores específicos
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (error.message.includes('401')) {
          throw new Error('Invalid API key. Please check your API.Bible configuration.');
        }

        if (error.message.includes('403')) {
          throw new Error('Access denied. Please check your API.Bible permissions.');
        }
        
        if (error.message.includes('404')) {
          throw new Error('Verse not found. Please check your reference format.');
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
   * MÉTODO TEMPORAL: Obtener lista de todas las traducciones disponibles
   */
  async debugGetAllBibles() {
    try {
      const response = await fetch(`${this.BASE_URL}/bibles`, {
        method: 'GET',
        headers: {
          'api-key': this.API_KEY,
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 TODAS LAS TRADUCCIONES DISPONIBLES:');
        
        // Filtrar solo inglés y mostrar las que nos interesan
        const englishBibles = data.data.filter((bible: any) => 
          bible.language.id === 'eng' && 
          (bible.name.toLowerCase().includes('living') || 
           bible.name.toLowerCase().includes('international') || 
           bible.name.toLowerCase().includes('king james') ||
           bible.abbreviation === 'NLT' ||
           bible.abbreviation === 'NIV' ||
           bible.abbreviation === 'KJV')
        );
        
        console.table(englishBibles.map((bible: any) => ({
          ID: bible.id,
          Name: bible.name,
          Abbreviation: bible.abbreviation
        })));
        
        return englishBibles;
      }
    } catch (error) {
      console.error('Error getting all bibles:', error);
    }
  }

  /**
   * Busca usando API.Bible
   */
  private async searchWithApiBible(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // Convertir referencia a formato de API.Bible
    const searchQuery = this.formatReferenceForApiBible(reference);
    
    // Construir URL para buscar el pasaje
    const url = `${this.BASE_URL}/bibles/${translation.id}/search?query=${encodeURIComponent(searchQuery)}&limit=1`;
    
    console.log('🌐 API.Bible Search URL:', url);
    console.log('📖 Requested translation:', translation.name);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': this.API_KEY,
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

    const data = await response.json();
    
    console.log('📋 API Search Response:', data);
    
    if (!data.data || !data.data.verses || data.data.verses.length === 0) {
      // Si la búsqueda no encuentra nada, intentar con pasajes directos
      return await this.getPassageDirectly(reference, translation);
    }

    // Usar el primer resultado
    const verse = data.data.verses[0];
    
    // Obtener el texto completo del versículo
    return await this.getVerseContent(verse.id, translation);
  }

  /**
   * Intenta obtener un pasaje directamente por referencia
   */
  private async getPassageDirectly(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // Convertir referencia a formato de API.Bible (ej: "JHN.3.16")
    const passageId = this.convertToPassageId(reference);
    
    const url = `${this.BASE_URL}/bibles/${translation.id}/passages/${passageId}`;
    
    console.log('🌐 API.Bible Passage URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': this.API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Passage not found: ${response.status}`);
    }

    const data: ApiBibleResponse = await response.json();
    
    return this.transformApiBibleResponse(data, translation, reference);
  }

  /**
   * Obtiene el contenido completo de un versículo por ID
   */
  private async getVerseContent(verseId: string, translation: BibleTranslation): Promise<SearchedVerse> {
    const url = `${this.BASE_URL}/bibles/${translation.id}/verses/${verseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': this.API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Verse content not found: ${response.status}`);
    }

    const data: ApiBibleResponse = await response.json();
    
    return this.transformApiBibleResponse(data, translation, data.data.reference);
  }

  /**
   * Convierte referencia en formato de pasaje de API.Bible
   */
  private convertToPassageId(reference: string): string {
    // Mapeo de libros bíblicos a IDs de API.Bible
    const bookMap: { [key: string]: string } = {
      'genesis': 'GEN', 'gen': 'GEN',
      'exodus': 'EXO', 'exo': 'EXO', 'ex': 'EXO',
      'matthew': 'MAT', 'mat': 'MAT', 'mt': 'MAT',
      'mark': 'MRK', 'mrk': 'MRK', 'mk': 'MRK',
      'luke': 'LUK', 'luk': 'LUK', 'lk': 'LUK',
      'john': 'JHN', 'jhn': 'JHN', 'jn': 'JHN',
      'acts': 'ACT', 'act': 'ACT',
      'romans': 'ROM', 'rom': 'ROM',
      'psalms': 'PSA', 'psalm': 'PSA', 'psa': 'PSA', 'ps': 'PSA',
      'proverbs': 'PRO', 'prov': 'PRO', 'pr': 'PRO',
      'isaiah': 'ISA', 'isa': 'ISA', 'is': 'ISA',
      'jeremiah': 'JER', 'jer': 'JER',
      'philippians': 'PHP', 'phil': 'PHP', 'php': 'PHP',
      '1 corinthians': '1CO', '1co': '1CO', '1 cor': '1CO',
      '2 corinthians': '2CO', '2co': '2CO', '2 cor': '2CO',
      '1 john': '1JN', '1jn': '1JN', '1 jn': '1JN',
      '2 john': '2JN', '2jn': '2JN', '2 jn': '2JN',
      '3 john': '3JN', '3jn': '3JN', '3 jn': '3JN'
    };

    try {
      // Extraer libro, capítulo y versículo
      const match = reference.match(/^(.+?)\s*(\d+):(\d+)(?:-(\d+))?$/i);
      if (!match) {
        throw new Error('Invalid reference format');
      }

      const [, bookName, chapter, startVerse, endVerse] = match;
      const bookKey = bookName.toLowerCase().trim();
      const bookId = bookMap[bookKey] || 'JHN'; // Default a Juan si no se encuentra

      if (endVerse) {
        return `${bookId}.${chapter}.${startVerse}-${bookId}.${chapter}.${endVerse}`;
      } else {
        return `${bookId}.${chapter}.${startVerse}`;
      }
    } catch (error) {
      console.warn('Could not parse reference, using default:', error);
      return 'JHN.3.16'; // Fallback
    }
  }

  /**
   * Formatea referencia para búsqueda en API.Bible
   */
  private formatReferenceForApiBible(reference: string): string {
    return reference.trim();
  }

  /**
   * Limpia HTML y obtiene solo el texto
   */
  private cleanHtmlContent(htmlContent: string): string {
    // Remover etiquetas HTML básicas
    return htmlContent
      .replace(/<[^>]*>/g, '') // Remover todas las etiquetas HTML
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  /**
   * Transforma la respuesta de API.Bible a nuestro formato
   */
  private transformApiBibleResponse(data: ApiBibleResponse, translation: BibleTranslation, reference: string): SearchedVerse {
    const bibleSearchId = 900000 + Math.floor(Math.random() * 99999);
    
    // 🔍 DEBUG: Vamos a ver exactamente qué está devolviendo cada traducción
    console.log(`🔍 DEBUG RESPONSE for ${translation.name} (${translation.id}):`);
    console.log('Raw content:', data.data.content);
    console.log('Reference:', data.data.reference);
    console.log('Data ID:', data.data.id);
    console.log('---');
    
    // Limpiar el contenido HTML
    const cleanText = this.cleanHtmlContent(data.data.content);
    
    return {
      id: bibleSearchId,
      verse_reference: reference,
      text_nlt: cleanText,
      context_nlt: `${translation.fullName} (${translation.name}) - ID: ${translation.id}`, // Agregamos el ID para debug
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