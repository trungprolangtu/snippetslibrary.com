import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  twitterHandle?: string;
  noIndex?: boolean;
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
  noIndex = false
}: SEOHeadProps) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

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

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', siteName, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', twitterHandle);
    updateMetaTag('twitter:creator', twitterHandle);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Update article-specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:published_time', publishedTime, true);
      updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = currentUrl;

    // Update structured data for code snippets
    if (type === 'article' && title && description) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: title,
        description: description,
        author: author ? {
          '@type': 'Person',
          name: author
        } : undefined,
        datePublished: publishedTime,
        dateModified: modifiedTime,
        url: currentUrl,
        image: image,
        publisher: {
          '@type': 'Organization',
          name: siteName
        }
      };

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
    }

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
  }, [title, description, keywords, image, currentUrl, type, author, publishedTime, modifiedTime, siteName, twitterHandle, noIndex]);

  return null; // This component doesn't render anything
}
