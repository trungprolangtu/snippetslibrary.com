import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
  const [origin, setOrigin] = useState('');
  
  // Set origin on client side to avoid SSR mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentUrl = canonical || url || `${origin}${location.pathname}`;
  const defaultImage = `${origin}/icons/web-app-manifest-512x512.png`;
  const finalImage = image || defaultImage;

  // Create structured data
  const structuredData: Record<string, unknown> = {
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
        url: `${origin}/icons/web-app-manifest-192x192.png`
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
      (structuredData.interactionStatistic as Array<Record<string, unknown>>).push({
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: viewCount
      });
    }
    
    if (likes) {
      (structuredData.interactionStatistic as Array<Record<string, unknown>>).push({
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction', 
        userInteractionCount: likes
      });
    }
  }

  if (readTime) {
    structuredData.timeRequired = `PT${readTime}M`;
  }

  return (
    <Helmet>
      <html lang={language} />
      
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="color-scheme" content="light dark" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={language} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article-specific tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:section" content={category} />
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Programming language-specific tags */}
      {codeLanguage && (
        <>
          <meta name="programmingLanguage" content={codeLanguage} />
          <meta name="codeLanguage" content={codeLanguage} />
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Alternate URLs */}
      {alternateUrls && Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
