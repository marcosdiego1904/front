# SEO Implementation Guide - Quick Start
## Lamp to My Feet

**Last Updated**: November 19, 2025

---

## What Was Implemented

### ✅ Core SEO Infrastructure

1. **Dynamic SEO System**
   - `src/components/SEO.tsx` - React component for SEO
   - `src/hooks/useSEO.ts` - Easy-to-use hook for any page
   - Pre-configured templates for all major pages

2. **Technical SEO**
   - Fixed `robots.txt` (was "robot.txt")
   - Enhanced `sitemap.xml` with all pages and current dates
   - Advanced meta tags in `index.html`
   - Schema.org JSON-LD structured data
   - Security headers in `vercel.json`

3. **Page-Specific SEO**
   - ✅ Homepage - Optimized for "Bible verse memorization"
   - ✅ Bible Search - Optimized for "Bible verse search"
   - ✅ About Page - Optimized for "Bible memorization platform"

4. **Performance & Security**
   - DNS prefetch and preconnect
   - Resource caching headers
   - Security headers (X-Frame-Options, CSP, etc.)

---

## How to Use the SEO System

### Option 1: Using the `useSEO` Hook (Recommended)

Add SEO to any page in 2 lines:

```tsx
import { useSEO, seoTemplates } from '@/hooks/useSEO';

function MyPage() {
  // Use a pre-configured template
  useSEO(seoTemplates.bibleSearch);

  return <div>Your page content</div>;
}
```

### Option 2: Custom SEO

For custom pages, provide your own SEO data:

```tsx
import { useSEO } from '@/hooks/useSEO';

function CustomPage() {
  useSEO({
    title: 'My Custom Page - Lamp to My Feet',
    description: 'A detailed description of my custom page',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    structuredData: {
      "@type": "WebPage",
      "name": "My Custom Page"
    }
  });

  return <div>Your page content</div>;
}
```

### Option 3: Using the SEO Component

```tsx
import SEO from '@/components/SEO';

function MyPage() {
  return (
    <>
      <SEO
        title="My Page Title"
        description="My page description"
        keywords={['keyword1', 'keyword2']}
      />
      <div>Your page content</div>
    </>
  );
}
```

---

## Available SEO Templates

Pre-configured templates in `seoTemplates`:

- `home` - Homepage
- `bibleSearch` - Bible Search page
- `learn` - Learning page
- `ranks` - Rankings/Leaderboard
- `about` - About page
- `support` - Support page
- `subscriptions` - Subscriptions page
- `dashboard` - User Dashboard (noindex)
- `profile` - User Profile (noindex)

### Example: Adding SEO to a New Page

```tsx
// pages/NewPage.tsx
import { useSEO } from '@/hooks/useSEO';

export default function NewPage() {
  useSEO({
    title: 'New Feature - Lamp to My Feet',
    description: 'Check out our new feature for Bible memorization',
    keywords: ['Bible', 'new feature', 'scripture'],
    structuredData: {
      "@type": "WebPage",
      "name": "New Feature",
      "description": "Our new Bible memorization feature"
    }
  });

  return (
    <div>
      <h1>New Feature</h1>
      <p>Content here...</p>
    </div>
  );
}
```

---

## Adding Breadcrumbs (Optional)

For better navigation and SEO, add breadcrumbs to any page:

```tsx
import Breadcrumbs from '@/components/Breadcrumbs';

export default function MyPage() {
  return (
    <div>
      <Breadcrumbs />
      <h1>Page Content</h1>
    </div>
  );
}
```

Breadcrumbs automatically:
- Generate from the current route
- Add BreadcrumbList structured data
- Provide navigation links

---

## Structured Data Types

The system supports these Schema.org types:

### WebSite (Homepage)
```javascript
{
  "@type": "WebSite",
  "name": "Lamp to My Feet",
  "url": "https://lamptomyfeet.co",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://lamptomyfeet.co/bible-search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### WebApplication (Bible Search)
```javascript
{
  "@type": "WebApplication",
  "name": "Bible Verse Search",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Course (Learning Pages)
```javascript
{
  "@type": "Course",
  "name": "Bible Verse Memorization Course",
  "provider": {
    "@type": "Organization",
    "name": "Lamp to My Feet"
  }
}
```

### Custom Structured Data

Add any Schema.org type:

```tsx
useSEO({
  title: 'Blog Post',
  structuredData: {
    "@type": "Article",
    "headline": "How to Memorize Bible Verses",
    "author": {
      "@type": "Person",
      "name": "Author Name"
    },
    "datePublished": "2025-11-19",
    "image": "https://lamptomyfeet.co/article-image.jpg"
  }
});
```

---

## Checking Your SEO

### Tools to Use

1. **Google Search Console**
   - Submit sitemap: `https://lamptomyfeet.co/sitemap.xml`
   - Monitor index coverage
   - Track keyword rankings

2. **Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Paste your page URL
   - Verify structured data is valid

3. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test: `https://lamptomyfeet.co`
   - Check Core Web Vitals

4. **Meta Tags Inspector**
   - Browser: Right-click → Inspect → `<head>` section
   - Verify meta tags are correct

### Quick SEO Checklist

After adding SEO to a page, verify:

- [ ] Page title is descriptive and unique
- [ ] Meta description is compelling (150-160 chars)
- [ ] Keywords are relevant and natural
- [ ] Structured data validates (Rich Results Test)
- [ ] Canonical URL is correct
- [ ] Open Graph image displays correctly
- [ ] No console errors
- [ ] Page loads fast (< 3 seconds)

---

## Best Practices

### Title Tags
✅ **Good**: "Bible Verse Search - Find Scripture | Lamp to My Feet"
❌ **Bad**: "Search" or "Lamp to My Feet - Bible Verse Search - Find Scripture - Memorization - Learning"

**Rules**:
- 50-60 characters
- Include primary keyword
- Brand at the end
- Unique per page

### Meta Descriptions
✅ **Good**: "Search any Bible verse from multiple translations (KJV, NIV, ESV). Instantly find and start memorizing scripture with our interactive tools."
❌ **Bad**: "Bible search page for Lamp to My Feet"

**Rules**:
- 150-160 characters
- Include call-to-action
- Match user intent
- Include keywords naturally

### Keywords
✅ **Good**: `['Bible verse search', 'scripture lookup', 'find Bible verses']`
❌ **Bad**: `['Bible', 'verse', 'search', 'scripture', 'find', ...]` (too generic/keyword stuffing)

**Rules**:
- 5-10 keywords max
- Mix of primary + long-tail
- Natural language
- Relevant to page content

### Structured Data
✅ **Do**:
- Use appropriate @type for content
- Include all required fields
- Test with Rich Results Test
- Keep data accurate and updated

❌ **Don't**:
- Use misleading data
- Duplicate structured data
- Include user-generated content markup
- Add irrelevant schema types

---

## Common Issues & Solutions

### Issue: SEO not updating

**Solution**: Hard refresh browser
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

### Issue: Duplicate meta tags

**Solution**: Ensure only one SEO call per page
```tsx
// ❌ Bad - Don't call useSEO multiple times
useSEO(seoTemplates.home);
useSEO({ title: 'Custom' }); // This will conflict

// ✅ Good - One call per page
useSEO({
  ...seoTemplates.home,
  title: 'Custom Title' // Override specific fields
});
```

### Issue: Structured data errors

**Solution**: Validate with Google Rich Results Test
1. Go to https://search.google.com/test/rich-results
2. Enter your page URL
3. Fix any errors shown
4. Re-test until valid

### Issue: Page not in Google

**Solutions**:
1. Submit sitemap in Google Search Console
2. Request indexing for specific URL
3. Ensure robots.txt allows crawling
4. Check for noindex tags (dashboard/profile should have noindex)
5. Wait 2-4 weeks for initial indexing

---

## Pages Needing SEO (TODO)

These pages still need SEO implementation:

- [ ] `/learn` - Learning flow page
- [ ] `/ranks` - Rankings page
- [ ] `/support` - Support page
- [ ] `/subscriptions` - Subscriptions page
- [ ] `/dashboard` - Dashboard (add noindex)
- [ ] `/profile` - Profile (add noindex)
- [ ] `/memorized-verses` - User verses (add noindex)

To add SEO to these pages:

1. Open the page component file
2. Import useSEO: `import { useSEO, seoTemplates } from '@/hooks/useSEO';`
3. Add inside component: `useSEO(seoTemplates.[pageName]);`
4. If no template exists, create custom SEO object

---

## Maintenance

### Monthly Tasks

1. **Update Sitemap**
   - Add new pages to `/public/sitemap.xml`
   - Update lastmod dates

2. **Check Rankings**
   - Google Search Console → Performance
   - Track target keyword positions

3. **Review Analytics**
   - Organic traffic trends
   - Top landing pages
   - Bounce rates

4. **Audit Content**
   - Update outdated information
   - Refresh meta descriptions
   - Add new keywords based on trends

### Quarterly Tasks

1. **Technical SEO Audit**
   - Run Screaming Frog (or similar)
   - Check for broken links
   - Verify all pages indexed
   - Review Core Web Vitals

2. **Competitor Analysis**
   - Check competitor rankings
   - Identify new keyword opportunities
   - Review their content strategy

3. **Content Refresh**
   - Update old blog posts
   - Add new sections to guides
   - Improve low-performing pages

---

## Advanced: Adding Blog Posts

When you create a blog, each post should have:

```tsx
import { useSEO } from '@/hooks/useSEO';

export default function BlogPost({ post }) {
  useSEO({
    title: `${post.title} - Lamp to My Feet Blog`,
    description: post.excerpt,
    keywords: post.tags,
    ogType: 'article',
    ogImage: post.featuredImage,
    structuredData: {
      "@type": "Article",
      "headline": post.title,
      "image": post.featuredImage,
      "datePublished": post.publishDate,
      "dateModified": post.modifiedDate,
      "author": {
        "@type": "Person",
        "name": post.authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lamp to My Feet",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lamptomyfeet.co/logo.png"
        }
      }
    }
  });

  return <article>{/* Blog content */}</article>;
}
```

---

## Resources

### Documentation
- [SEO_STRATEGY.md](./SEO_STRATEGY.md) - Comprehensive strategy
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/)

### Testing
```bash
# Build production version
npm run build

# Preview production build
npm run preview

# Test locally at http://localhost:4173
```

---

## Questions?

If you need help implementing SEO on a specific page:

1. Check this guide first
2. Review `SEO_STRATEGY.md` for broader context
3. Look at existing implementations (Homepage, Bible Search, About)
4. Test with Google Rich Results Test
5. Consult Schema.org documentation for specific types

**Remember**: Good SEO takes time. Focus on creating valuable content for users, and search engines will follow.

---

**Last Updated**: November 19, 2025
**Implemented By**: Claude Code
**Maintained By**: Development Team
