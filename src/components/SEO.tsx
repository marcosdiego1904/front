import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
}

/**
 * SEO Component - Dynamically updates page meta tags for optimal search engine optimization
 *
 * Features:
 * - Dynamic title and description
 * - Open Graph tags for social sharing
 * - Twitter Card support
 * - JSON-LD structured data
 * - Canonical URLs
 * - Keyword optimization
 *
 * @example
 * ```tsx
 * <SEO
 *   title="Bible Verse Search - Lamp to My Feet"
 *   description="Search and memorize Bible verses with our interactive learning platform"
 *   keywords={['Bible search', 'scripture lookup', 'Bible verses']}
 *   structuredData={{
 *     "@type": "WebPage",
 *     "name": "Bible Search"
 *   }}
 * />
 * ```
 */
export default function SEO({
  title,
  description,
  keywords = [],
  ogType = 'website',
  ogImage,
  canonicalUrl,
  structuredData,
  noIndex = false
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // Default values
    const defaultTitle = 'Lamp to My Feet - Memorize Bible Verses Through Gamified Learning';
    const defaultDescription = 'Transform your Bible study with Lamp to My Feet. Memorize scripture through proven techniques, gamification, and interactive learning. Join thousands mastering God\'s Word with our engaging platform.';
    const defaultKeywords = [
      'Bible verse memorization',
      'scripture memory',
      'Bible study app',
      'Christian learning platform',
      'memorize Bible verses',
      'Bible memory techniques',
      'gamified Bible study',
      'scripture memorization app',
      'Christian education',
      'Bible memory game',
      'learn Bible verses',
      'scripture retention'
    ];

    // Update title
    const pageTitle = title || defaultTitle;
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('name', 'description', description || defaultDescription);
    updateMetaTag('name', 'keywords', [...defaultKeywords, ...keywords].join(', '));
    updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph tags
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', description || defaultDescription);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', canonicalUrl || `https://lamptomyfeet.co${location.pathname}`);
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }

    // Twitter Card tags
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', description || defaultDescription);
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl || `https://lamptomyfeet.co${location.pathname}`);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[data-structured-data]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-structured-data', 'true');
        document.head.appendChild(script);
      }

      // Merge with base organization data
      const baseData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "name": "Lamp to My Feet",
            "url": "https://lamptomyfeet.co",
            "logo": {
              "@type": "ImageObject",
              "url": "https://lamptomyfeet.co/src/oil-lamp.png"
            },
            "description": "Interactive Bible verse memorization platform using proven learning techniques and gamification",
            "sameAs": []
          }
        ]
      };

      // Add page-specific structured data to the graph
      if (Array.isArray(structuredData)) {
        baseData["@graph"].push(...structuredData);
      } else if (typeof structuredData === 'object') {
        baseData["@graph"].push(structuredData);
      }

      script.textContent = JSON.stringify(baseData);
    }

  }, [title, description, keywords, ogType, ogImage, canonicalUrl, structuredData, noIndex, location.pathname]);

  // This component doesn't render anything
  return null;
}

/**
 * Pre-configured SEO templates for common pages
 */
export const SEOTemplates = {
  home: {
    title: 'Lamp to My Feet - Memorize Bible Verses Through Gamified Learning',
    description: 'Transform your Bible study with Lamp to My Feet. Memorize scripture through proven techniques, gamification, and interactive learning. Join thousands mastering God\'s Word.',
    keywords: ['Bible verse memorization', 'scripture memory app', 'Christian learning platform', 'Bible study gamification'],
    structuredData: {
      "@type": "WebSite",
      "name": "Lamp to My Feet",
      "description": "Interactive Bible verse memorization platform",
      "url": "https://lamptomyfeet.co",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lamptomyfeet.co/bible-search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },

  bibleSearch: {
    title: 'Bible Verse Search - Find & Memorize Scripture | Lamp to My Feet',
    description: 'Search any Bible verse from multiple translations (KJV, NIV, NLT, ESV). Instantly find, compare, and start memorizing scripture with our interactive learning tools.',
    keywords: ['Bible verse search', 'scripture lookup', 'Bible translations', 'KJV search', 'NIV search', 'find Bible verses'],
    structuredData: {
      "@type": "WebApplication",
      "name": "Bible Verse Search",
      "applicationCategory": "EducationalApplication",
      "description": "Search and compare Bible verses across multiple translations",
      "url": "https://lamptomyfeet.co/bible-search",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },

  learn: {
    title: 'Interactive Bible Memorization - 5-Step Learning Method | Lamp to My Feet',
    description: 'Master Bible verses through our proven 5-step method: Read, Breakdown, Fill Blanks, Write, Review. Science-backed techniques for lasting scripture memorization.',
    keywords: ['Bible memorization method', 'scripture learning technique', 'how to memorize Bible verses', 'Bible memory training'],
    structuredData: {
      "@type": "Course",
      "name": "Bible Verse Memorization Course",
      "description": "Interactive course teaching Bible verse memorization through proven techniques",
      "provider": {
        "@type": "Organization",
        "name": "Lamp to My Feet"
      }
    }
  },

  ranks: {
    title: 'Leaderboard & Rankings - Bible Memorization Challenge | Lamp to My Feet',
    description: 'Join our global community of Bible memorizers. Track your progress, earn ranks from Seeker to Lion, and compete on the leaderboard as you master scripture.',
    keywords: ['Bible memorization leaderboard', 'scripture challenge', 'Bible memory competition', 'Christian gamification'],
    structuredData: {
      "@type": "WebPage",
      "name": "Rankings & Leaderboard",
      "description": "Community leaderboard for Bible verse memorization",
      "url": "https://lamptomyfeet.co/ranks"
    }
  },

  about: {
    title: 'About Us - Making Bible Memorization Engaging | Lamp to My Feet',
    description: 'Learn how Lamp to My Feet combines neuroscience, gamification, and faith to help Christians memorize scripture effectively. Our mission: make God\'s Word unforgettable.',
    keywords: ['about Lamp to My Feet', 'Bible memorization platform', 'Christian education mission', 'scripture memory vision'],
    structuredData: {
      "@type": "AboutPage",
      "name": "About Lamp to My Feet",
      "description": "Learn about our mission to help Christians memorize scripture",
      "url": "https://lamptomyfeet.co/about"
    }
  },

  support: {
    title: 'Support & Help Center - Bible Memorization Guide | Lamp to My Feet',
    description: 'Get help with Lamp to My Feet. Find answers about Bible verse memorization, account management, subscriptions, and technical support.',
    keywords: ['Bible app support', 'memorization help', 'scripture learning guide', 'Lamp to My Feet help'],
    structuredData: {
      "@type": "ContactPage",
      "name": "Support",
      "description": "Get help and support for using Lamp to My Feet",
      "url": "https://lamptomyfeet.co/support"
    }
  },

  subscriptions: {
    title: 'Premium Subscription - Unlock Advanced Bible Study Features',
    description: 'Upgrade to Premium for unlimited verses, multiple translations, advanced tracking, and ad-free Bible memorization. Invest in mastering God\'s Word.',
    keywords: ['Bible app subscription', 'premium Bible study', 'Christian app pricing', 'Bible memorization premium'],
    structuredData: {
      "@type": "Product",
      "name": "Lamp to My Feet Premium",
      "description": "Premium subscription for advanced Bible memorization features",
      "url": "https://lamptomyfeet.co/subscriptions"
    }
  },

  dashboard: {
    title: 'My Dashboard - Bible Memorization Progress',
    description: 'Track your Bible memorization journey. View your progress, stats, memorized verses, and achievements in your personal dashboard.',
    keywords: ['Bible study dashboard', 'memorization progress', 'scripture tracking'],
    noIndex: true // Don't index user-specific pages
  },

  profile: {
    title: 'My Profile - Account Settings',
    description: 'Manage your Lamp to My Feet account settings and preferences.',
    keywords: ['account settings', 'profile management'],
    noIndex: true
  }
};
