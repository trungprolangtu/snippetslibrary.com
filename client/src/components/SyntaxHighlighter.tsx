import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  theme?: 'dark-plus' | 'light-plus';
  className?: string;
}

// Create a singleton highlighter instance to avoid recreating it
let globalHighlighter: Highlighter | null = null;

export function SyntaxHighlighter({
  code,
  language,
  theme = 'dark-plus',
  className = '',
}: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        
        // Initialize highlighter if not already done
        if (!globalHighlighter) {
          globalHighlighter = await createHighlighter({
            themes: [theme],
            langs: [], // Start with no languages, load them dynamically
          });
        }

        // Check if the language is already loaded
        const loadedLanguages = globalHighlighter.getLoadedLanguages();
        if (!loadedLanguages.includes(language)) {
          // Dynamically load the language
          await globalHighlighter.loadLanguage(language as BundledLanguage);
        }

        // Check if the theme is already loaded
        const loadedThemes = globalHighlighter.getLoadedThemes();
        if (!loadedThemes.includes(theme)) {
          await globalHighlighter.loadTheme(theme);
        }

        if (!cancelled) {
          const html = globalHighlighter.codeToHtml(code, {
            lang: language,
            theme: theme,
          });
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error('Error highlighting code:', error);
        if (!cancelled) {
          setHighlightedCode(`<pre><code>${code}</code></pre>`);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  if (isLoading) {
    return (
      <div className={`bg-muted rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!highlightedCode) {
    return (
      <div className={`bg-muted rounded-lg p-4 ${className}`}>
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
