# SEO and Metadata System

This document describes the comprehensive SEO and metadata system implemented in the Yeko Admin application.

## Overview

The SEO system provides:
- **Centralized metadata management** with Next.js Metadata API
- **Dynamic Open Graph image generation**
- **Structured data (JSON-LD) support**
- **Social media sharing optimization**
- **PWA manifest generation**
- **Client-side metadata hooks**

## Core Components

### 1. Metadata Configuration (`src/lib/metadata.ts`)

Central configuration for site-wide metadata:

```typescript
import { generateMetadata } from '@/lib/metadata';

// Generate metadata for any page
const metadata = generateMetadata({
  title: "Dashboard",
  description: "Manage your application efficiently",
  keywords: ["dashboard", "admin", "management"],
  url: "/dashboard",
});
```

### 2. SEO Utilities (`src/lib/seo.ts`)

Advanced SEO utilities with templates:

```typescript
import { seoTemplates, createSEOMetadata } from '@/lib/seo';

// Use predefined templates
export const metadata = seoTemplates.dashboard("Users", "Manage user accounts");

// Or create custom metadata
export const metadata = createSEOMetadata({
  title: "Custom Page",
  description: "Custom description",
  keywords: ["custom", "page"],
  type: "article",
});
```

### 3. Page-Specific Metadata (`src/lib/page-metadata.ts`)

Specialized metadata generators:

```typescript
import { generateDashboardMetadata, generateAuthMetadata } from '@/lib/page-metadata';

// Dashboard pages
export const metadata = generateDashboardMetadata("Analytics", "View your analytics data");

// Authentication pages
export const metadata = generateAuthMetadata("login");
```

## Dynamic Open Graph Images

The system includes an API route (`/api/og`) that generates dynamic Open Graph images:

```typescript
// Automatic generation
const imageUrl = generateOGImageUrl({
  title: "My Page Title",
  description: "Page description",
  type: "article"
});

// Manual URL
const imageUrl = "/api/og?title=My%20Page&description=Description&type=article";
```

### Image Features

- **Dynamic text rendering** with proper typography
- **Brand-consistent design** with logo and colors
- **Responsive sizing** (customizable width/height)
- **Type indicators** (website, article, profile)
- **Fallback handling** for missing fonts

## Usage Examples

### 1. Page Metadata (App Router)

```typescript
// app/dashboard/page.tsx
import { generateDashboardMetadata } from '@/lib/page-metadata';

export const metadata = generateDashboardMetadata("Dashboard", "Main dashboard overview");

export default function DashboardPage() {
  return <div>Dashboard content</div>;
}
```

### 2. Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import { generateArticleMetadata } from '@/lib/page-metadata';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const article = await getArticle(params.slug);
  
  return generateArticleMetadata({
    title: article.title,
    description: article.excerpt,
    author: article.author,
    publishedTime: article.publishedAt,
    slug: params.slug,
    tags: article.tags,
  });
}
```

### 3. Client-Side Metadata

```typescript
// components/MyComponent.tsx
import { useMetadata, useStructuredData } from '@/hooks/useMetadata';

export function MyComponent() {
  useMetadata({
    title: "Dynamic Title",
    description: "Dynamic description",
    keywords: ["dynamic", "content"],
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "My Article",
    author: "John Doe",
  });

  return <div>Component content</div>;
}
```

### 4. Social Sharing

```typescript
// components/ShareButton.tsx
import { useSocialShare } from '@/hooks/useMetadata';

export function ShareButton({ url, title, description }: Props) {
  const { share, canShare, socialUrls, copyToClipboard } = useSocialShare({
    url,
    title,
    description,
  });

  return (
    <div>
      {canShare && (
        <button onClick={share}>Share</button>
      )}
      <a href={socialUrls.twitter}>Share on Twitter</a>
      <a href={socialUrls.facebook}>Share on Facebook</a>
      <button onClick={copyToClipboard}>Copy Link</button>
    </div>
  );
}
```

## Structured Data (JSON-LD)

The system supports various structured data types:

### Organization Schema

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  sameAs: [
    siteConfig.social.twitter,
    siteConfig.social.github,
  ],
};
```

### Article Schema

```typescript
const articleSchema = createArticleMetadata({
  title: "Article Title",
  description: "Article description",
  author: "Author Name",
  publishedTime: "2024-01-01T00:00:00Z",
  url: "/articles/my-article",
});
```

### Breadcrumb Schema

```typescript
const breadcrumbSchema = createBreadcrumbMetadata([
  { name: "Home", url: "/" },
  { name: "Dashboard", url: "/dashboard" },
  { name: "Users", url: "/dashboard/users" },
]);
```

## PWA Manifest

The system generates a dynamic web app manifest at `/site.webmanifest`:

```json
{
  "name": "Yeko Admin",
  "short_name": "Yeko",
  "description": "Modern admin dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "icons": [...],
  "shortcuts": [...]
}
```

## Environment Variables

Configure these environment variables for optimal SEO:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional - Site verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_SITE_VERIFICATION=your_yahoo_verification_code
BING_SITE_VERIFICATION=your_bing_verification_code
```

## Best Practices

### 1. Title Optimization

- Keep titles under 60 characters
- Include primary keywords
- Use consistent branding
- Avoid keyword stuffing

### 2. Description Optimization

- Keep descriptions between 150-160 characters
- Include compelling call-to-action
- Summarize page content accurately
- Use active voice

### 3. Image Optimization

- Use descriptive alt text
- Optimize file sizes
- Use appropriate dimensions (1200x630 for OG images)
- Include brand elements

### 4. Structured Data

- Use appropriate schema types
- Include all required properties
- Test with Google's Rich Results Test
- Keep data accurate and up-to-date

### 5. Performance

- Minimize metadata size
- Use efficient image formats
- Implement proper caching
- Avoid blocking resources

## Testing and Validation

### Tools for Testing

1. **Google Search Console** - Monitor search performance
2. **Google Rich Results Test** - Validate structured data
3. **Facebook Sharing Debugger** - Test Open Graph tags
4. **Twitter Card Validator** - Validate Twitter cards
5. **Lighthouse** - Overall SEO audit

### Validation Checklist

- [ ] All pages have unique titles and descriptions
- [ ] Open Graph images generate correctly
- [ ] Structured data validates without errors
- [ ] Social sharing works across platforms
- [ ] PWA manifest is accessible
- [ ] Canonical URLs are correct
- [ ] Robots.txt allows proper crawling

## Troubleshooting

### Common Issues

1. **Missing OG Images**: Check font files in `/src/assets/fonts/`
2. **Invalid Structured Data**: Validate JSON-LD syntax
3. **Duplicate Meta Tags**: Ensure proper metadata hierarchy
4. **Caching Issues**: Clear CDN cache after updates

### Debug Mode

Enable debug logging in development:

```typescript
// Add to your page component
console.log('Metadata:', metadata);
console.log('Structured Data:', structuredData);
```

## Migration Guide

### From Static Meta Tags

1. Remove static `<meta>` tags from HTML
2. Implement `generateMetadata` functions
3. Use metadata utilities for consistency
4. Test all pages thoroughly

### From Other SEO Libraries

1. Map existing configurations to new system
2. Update component implementations
3. Migrate structured data schemas
4. Verify social sharing functionality

## Performance Considerations

- **Metadata Generation**: Computed at build time when possible
- **Image Generation**: Cached with proper headers
- **Client-Side Updates**: Minimal DOM manipulation
- **Bundle Size**: Tree-shaking eliminates unused utilities

## Future Enhancements

- **Multi-language Support**: i18n metadata generation
- **A/B Testing**: Dynamic metadata optimization
- **Analytics Integration**: SEO performance tracking
- **Advanced Schemas**: More structured data types