// src/services/bibleApi.ts
// bible-api.com implementation with KJV, WEB, and ASV

export interface BibleTranslation {
  id: string;
  name: string;
  fullName: string;
  apiSource: 'bible-api' | 'rapidapi-niv' | 'nlt-api';
  description: string;
  readingLevel: string;
  approach: string;
  bestFor: string;
  year: string;
  features: string[];
  premium: boolean; // Premium-only translation flag
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

  // ✅ Multiple translations available (free + premium)
  private translations: BibleTranslation[] = [
    // FREE TRANSLATIONS
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
      ],
      premium: false
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
      ],
      premium: false
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
      ],
      premium: false
    },
    // PREMIUM TRANSLATIONS
    {
      id: 'niv',
      name: 'NIV',
      fullName: 'New International Version',
      apiSource: 'rapidapi-niv',
      description: 'The world\'s most popular modern Bible translation, balancing readability with accuracy.',
      readingLevel: 'Grade 7-8 (Easy to read)',
      approach: 'Dynamic equivalence (Thought-for-thought translation)',
      bestFor: 'General reading, study, memorization, contemporary worship',
      year: '1978 (updated 2011)',
      features: [
        'Most widely read modern translation worldwide',
        'Clear, natural English that flows beautifully',
        'Trusted by millions of Christians globally',
        'Perfect balance of accuracy and readability',
        'Ideal for memorization and daily devotions'
      ],
      premium: true
    },
    {
      id: 'nlt',
      name: 'NLT',
      fullName: 'New Living Translation',
      apiSource: 'nlt-api',
      description: 'A dynamic, easy-to-understand translation that brings Scripture to life in contemporary language.',
      readingLevel: 'Grade 6 (Very easy to read)',
      approach: 'Dynamic equivalence (Meaning-for-meaning translation)',
      bestFor: 'New believers, devotional reading, understanding difficult passages',
      year: '1996 (updated 2015)',
      features: [
        'Crystal-clear modern English',
        'Makes complex passages easy to understand',
        'Excellent for new Christians and young readers',
        'Smooth, natural reading experience',
        'Great for devotional and inspirational reading'
      ],
      premium: true
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
   * Busca un versículo (con soporte para traducciones premium)
   */
  async searchVerse(reference: string, translationId: string = this.defaultTranslation, isPremiumUser: boolean = false): Promise<SearchedVerse> {
    try {
      const translation = this.translations.find(t => t.id === translationId) || this.translations[0];
      const cleanedReference = this.cleanReference(reference);

      // Check premium access
      if (translation.premium && !isPremiumUser) {
        throw new Error(`${translation.name} is a premium translation. Upgrade to Pro to access NIV, NLT, and more!`);
      }

      console.log(`🔍 Searching for verse: ${cleanedReference} in ${translation.name}`);

      let verseData: SearchedVerse;

      // Route to appropriate API based on source
      switch (translation.apiSource) {
        case 'bible-api':
          verseData = await this.searchWithBibleApi(cleanedReference, translation);
          break;
        case 'rapidapi-niv':
          verseData = await this.searchWithRapidApiNIV(cleanedReference, translation);
          break;
        case 'nlt-api':
          verseData = await this.searchWithNLTApi(cleanedReference, translation);
          break;
        default:
          throw new Error(`Unsupported API source: ${translation.apiSource}`);
      }

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
   * Busca usando RapidAPI NIV
   */
  private async searchWithRapidApiNIV(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // Parse the reference (e.g., "John 3:16" -> Book=John, Chapter=3, Verse=16)
    const parsedRef = this.parseReference(reference);

    try {
      let allVerses: any[] = [];

      // If it's a verse range, fetch all verses in the range
      if (parsedRef.endVerse) {
        console.log(`📖 Fetching NIV verse range: ${parsedRef.verse}-${parsedRef.endVerse}`);

        for (let v = parsedRef.verse; v <= parsedRef.endVerse; v++) {
          const url = `https://niv-bible.p.rapidapi.com/row?Book=${encodeURIComponent(parsedRef.book)}&Chapter=${parsedRef.chapter}&Verse=${v}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '563ea39f66msh0512ba3143fdccfp1bb39fjsnde81db4498b1',
              'x-rapidapi-host': 'niv-bible.p.rapidapi.com',
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(30000)
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`RapidAPI NIV Response Error for verse ${v}:`, errorText);
            throw new Error(`NIV API returned ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (Array.isArray(data)) {
            allVerses.push(...data);
          } else {
            allVerses.push(data);
          }
        }
      } else {
        // Single verse
        const url = `https://niv-bible.p.rapidapi.com/row?Book=${encodeURIComponent(parsedRef.book)}&Chapter=${parsedRef.chapter}&Verse=${parsedRef.verse}`;
        console.log('🌐 Fetching NIV verse:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '563ea39f66msh0512ba3143fdccfp1bb39fjsnde81db4498b1',
            'x-rapidapi-host': 'niv-bible.p.rapidapi.com',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('RapidAPI NIV Response Error:', errorText);
          throw new Error(`NIV API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        allVerses = Array.isArray(data) ? data : [data];
      }

      if (allVerses.length === 0) {
        throw new Error('No verse found for this reference in NIV.');
      }

      // Extract text from all verses - NIV API has nested structure
      const verseTexts = allVerses.map(verseData => {
        // NIV API structure: { "Text": { "21888": "actual verse text" } }
        // We need to extract the text from the nested object

        if (verseData.Text && typeof verseData.Text === 'object') {
          // Get the first value from the Text object
          const textValues = Object.values(verseData.Text);
          if (textValues.length > 0) {
            return textValues[0] as string;
          }
        }

        // Fallback to direct properties
        return verseData.verse || verseData.text || verseData.content || '';
      }).filter(Boolean);

      if (verseTexts.length === 0) {
        console.error('NIV API response missing verse text. Full response:', allVerses);
        throw new Error('NIV API returned data but verse text field is missing. Please check console for details.');
      }

      const combinedText = verseTexts.join(' ');

      const verseRef = parsedRef.endVerse
        ? `${parsedRef.book} ${parsedRef.chapter}:${parsedRef.verse}-${parsedRef.endVerse}`
        : `${parsedRef.book} ${parsedRef.chapter}:${parsedRef.verse}`;

      return {
        id: 800000 + Math.floor(Math.random() * 99999),
        verse_reference: verseRef,
        text_nlt: combinedText,
        context_nlt: '',
        translation: translation,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error('⏱️ NIV API timeout - API is slow or unreachable');
        throw new Error('NIV API timed out. The service may be slow or unavailable. Please try again or use a different translation.');
      }
      throw error;
    }
  }

  /**
   * Busca usando NLT API
   */
  private async searchWithNLTApi(reference: string, translation: BibleTranslation): Promise<SearchedVerse> {
    // NLT API uses references like "John.3.16" or "John.1"
    const formattedRef = reference.replace(/\s+/g, '.').replace(/:/g, '.');

    const url = `https://api.nlt.to/api/passages?ref=${encodeURIComponent(formattedRef)}&version=NLT&key=e109f896-e965-4dcf-aeda-cf5af78098cf`;

    console.log('🌐 NLT API URL:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(30000) // Increased to 30 seconds
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('NLT API Response Error:', errorText);
        throw new Error(`NLT API returned ${response.status}: ${response.statusText}`);
      }

      // NLT API returns HTML by default, but we can parse it
      const html = await response.text();

      // Extract text from HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Get the verse text (NLT API wraps verses in specific tags)
      const verseText = doc.body.textContent?.trim() || '';

      if (!verseText) {
        throw new Error('No verse found for this reference in NLT.');
      }

      // Clean up the text (remove reference, translation name, verse numbers, etc.)
      let cleanedText = verseText;

      // Step 1: Remove book references at the start (various formats)
      // Matches: "Psalm 23", "John 3:16", "Philippians 4:6-7", "Genesis 1", "1 John 3:16-17", etc.
      cleanedText = cleanedText.replace(/^(\d+\s+)?[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s+\d+(:(\d+)(-\d+)?)?\s*/i, '');

      // Step 2: Remove translation names (NLT, NIV, KJV, etc.)
      cleanedText = cleanedText.replace(/^,?\s*(NLT|NIV|KJV|ESV|NASB|NKJV|MSG|AMP|CSB|HCSB)\s*/i, '');

      // Step 3: Remove common Psalm titles and attributions (often capitalized phrases before the verse)
      // Matches: "The Lord Is My Shepherd", "A psalm of David.", "Of David.", etc.
      cleanedText = cleanedText.replace(/^([A-Z][a-z]+(\s+[A-Z][a-z]+)*\.?\s*)+/g, (match) => {
        // Only remove if it's likely a title (contains multiple capital words or ends with a period)
        if (match.split(/\s+/).filter(w => /^[A-Z]/.test(w)).length > 2 || match.includes('.')) {
          return '';
        }
        return match;
      });

      // Step 4: Remove verse numbers that appear inline (e.g., "6Don't" -> "Don't")
      cleanedText = cleanedText.replace(/\b\d+(?=[A-Z])/g, ''); // "6Don't" -> "Don't"
      cleanedText = cleanedText.replace(/\s+\d+(?=[A-Z])/g, ' '); // " 7Then" -> " Then"

      // Step 5: Remove footnote markers like [1], [2], etc.
      cleanedText = cleanedText.replace(/\[\d+\]/g, '');

      // Step 6: Normalize whitespace and trim
      cleanedText = cleanedText.replace(/\s+/g, ' ').trim();

      // Step 7: Ensure first character is uppercase (in case we removed too much)
      if (cleanedText.length > 0) {
        cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
      }

      return {
        id: 800000 + Math.floor(Math.random() * 99999),
        verse_reference: reference.trim(),
        text_nlt: cleanedText,
        context_nlt: '',
        translation: translation,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error('⏱️ NLT API timeout - API is slow or unreachable');
        throw new Error('NLT API timed out. The service may be slow or unavailable. Please try again or use a different translation.');
      }
      throw error;
    }
  }

  /**
   * Analiza una referencia bíblica en sus componentes
   */
  private parseReference(reference: string): { book: string; chapter: number; verse: number; endVerse?: number } {
    // Match patterns like "John 3:16", "1 John 3:16", "Psalm 23:1", or "John 3:16-17"
    const singleVerseMatch = reference.match(/^(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)$/);
    const rangeMatch = reference.match(/^(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)-(\d+)$/);

    if (rangeMatch) {
      // Verse range like "Philippians 4:6-7"
      const book = rangeMatch[1].trim();
      const chapter = parseInt(rangeMatch[2], 10);
      const verse = parseInt(rangeMatch[3], 10);
      const endVerse = parseInt(rangeMatch[4], 10);

      return { book, chapter, verse, endVerse };
    } else if (singleVerseMatch) {
      // Single verse like "John 3:16"
      const book = singleVerseMatch[1].trim();
      const chapter = parseInt(singleVerseMatch[2], 10);
      const verse = parseInt(singleVerseMatch[3], 10);

      return { book, chapter, verse };
    } else {
      throw new Error(`Invalid reference format: ${reference}. Use format like "John 3:16" or "John 3:16-17"`);
    }
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

    // The context string is no longer needed as the translation is displayed separately.
    // let contextInfo = `${translation.fullName}`;
    
    // if (data.translation_name && data.translation_name !== translation.fullName) {
    //   contextInfo += ` (API returned: ${data.translation_name})`;
    // }
    
    // if (data.verses && data.verses.length > 0) {
    //   const bookName = data.verses[0].book_name;
    //   const uniqueBooks = [...new Set(data.verses.map(v => v.book_name))];
      
    //   if (uniqueBooks.length === 1) {
    //     contextInfo += ` - Book: ${bookName}`;
    //   } else {
    //     contextInfo += ` - Books: ${uniqueBooks.join(', ')}`;
    //   }
    // }
    
    return {
      id: bibleSearchId,
      verse_reference: verseReference.trim(),
      text_nlt: verseText.replace(/(\r\n|\n|\r)/gm, " ").trim(),
      context_nlt: '', // Set to empty string to avoid displaying extra info
      translation: translation,
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
  getExampleReferences(): { category: string; verses: string[]; emoji: string; description: string }[] {
    return [
      {
        category: 'Popular Favorites',
        emoji: '⭐',
        description: 'Most memorized verses of all time',
        verses: ['John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Jeremiah 29:11']
      },
      {
        category: 'Anxiety & Worry',
        emoji: '🕊️',
        description: 'Find peace in stressful moments',
        verses: ['Philippians 4:6-7', 'Matthew 6:34', 'Isaiah 41:10', 'Psalm 94:19']
      },
      {
        category: 'Strength & Courage',
        emoji: '💪',
        description: 'Power to face any challenge',
        verses: ['Joshua 1:9', 'Isaiah 40:31', 'Psalm 46:1', 'Ephesians 6:10']
      },
      {
        category: 'Comfort & Peace',
        emoji: '🌿',
        description: 'Rest for your weary soul',
        verses: ['Psalm 23:1', 'Matthew 11:28', 'John 14:27', '2 Corinthians 1:3-4']
      },
      {
        category: 'Love & Relationships',
        emoji: '❤️',
        description: 'God\'s love and how to love others',
        verses: ['1 Corinthians 13:4-7', '1 John 4:8', 'John 13:34', 'Romans 5:8']
      },
      {
        category: 'Wisdom & Guidance',
        emoji: '🧭',
        description: 'Direction for life\'s decisions',
        verses: ['Proverbs 3:5-6', 'James 1:5', 'Psalm 32:8', 'Proverbs 16:3']
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