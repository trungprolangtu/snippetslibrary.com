import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  twitterHandle?: string;
  noIndex?: boolean;
  language?: string;
  codeLanguage?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  viewCount?: number;
  likes?: number;
  canonical?: string;
  alternateUrls?: Record<string, string>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  siteName = 'Snippets Library',
  twitterHandle,
  noIndex = false,
  language = 'en',
  codeLanguage,
  category,
  tags = [],
  readTime,
  viewCount,
  likes,
  canonical,
  alternateUrls,
  breadcrumbs
}: SEOHeadProps) {
  const location = useLocation();
  const currentUrl = canonical || url || `${window.location.origin}${location.pathname}`;
  const defaultImage = `${window.location.origin}/icons/web-app-manifest-512x512.png`;
  const finalImage = image || defaultImage;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string | undefined, property = false) => {
      if (!content) return;

      const attribute = property ? 'property' : 'name';
      const selector = `meta[${attribute}="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('theme-color', '#3b82f6');
    updateMetaTag('color-scheme', 'light dark');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', language, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', twitterHandle);
    updateMetaTag('twitter:creator', twitterHandle);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', finalImage);
    updateMetaTag('twitter:image:alt', title);

    // Update article-specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:published_time', publishedTime, true);
      updateMetaTag('article:modified_time', modifiedTime, true);
      updateMetaTag('article:section', category, true);
      
      // Add article tags
      if (tags.length > 0) {
        tags.forEach(tag => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    // Update programming language-specific tags
    if (codeLanguage) {
      updateMetaTag('programmingLanguage', codeLanguage);
      updateMetaTag('codeLanguage', codeLanguage);
    }

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = currentUrl;

    // Add alternate URLs for different languages
    if (alternateUrls) {
      Object.entries(alternateUrls).forEach(([lang, url]) => {
        let alternateElement = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
        if (!alternateElement) {
          alternateElement = document.createElement('link');
          alternateElement.rel = 'alternate';
          alternateElement.hreflang = lang;
          document.head.appendChild(alternateElement);
        }
        alternateElement.href = url;
      });
    }

    // Update structured data
    const structuredData: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'SoftwareSourceCode' : 'WebPage',
      name: title,
      description: description,
      url: currentUrl,
      image: finalImage,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: author ? {
        '@type': 'Person',
        name: author
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/icons/web-app-manifest-192x192.png`
        }
      }
    };

    // Add code-specific structured data
    if (type === 'article' && codeLanguage) {
      structuredData.programmingLanguage = codeLanguage;
      structuredData.codeRepository = currentUrl;
      structuredData.applicationCategory = 'DeveloperApplication';
      structuredData.applicationSubCategory = 'CodeSnippet';
    }

    // Add breadcrumbs
    if (breadcrumbs && breadcrumbs.length > 0) {
      structuredData.breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      };
    }

    // Add interaction statistics
    if (viewCount || likes || readTime) {
      structuredData.interactionStatistic = [];
      
      if (viewCount) {
        structuredData.interactionStatistic.push({
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ViewAction',
          userInteractionCount: viewCount
        });
      }
      
      if (likes) {
        structuredData.interactionStatistic.push({
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction', 
          userInteractionCount: likes
        });
      }
    }

    if (readTime) {
      structuredData.timeRequired = `PT${readTime}M`;
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // Only remove dynamic meta tags, keep static ones
      const dynamicTags = [
        'meta[name="description"]',
        'meta[name="keywords"]',
        'meta[name="author"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:image"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
        'meta[property="article:author"]',
        'meta[property="article:published_time"]',
        'meta[property="article:modified_time"]',
        'script[type="application/ld+json"]'
      ];

      dynamicTags.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      });
    };
  }, [title, description, keywords, finalImage, currentUrl, type, author, publishedTime, modifiedTime, siteName, twitterHandle, noIndex, language, codeLanguage, category, tags, readTime, viewCount, likes, alternateUrls, breadcrumbs]);

  return null; // This component doesn't render anything
}
