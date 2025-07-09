import { useEffect, useState } from 'react';
import { shikiService } from '../lib/shiki';
import DOMPurify from 'dompurify';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  theme?: 'dark-plus' | 'light-plus';
  className?: string;
}

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
        
        // Sanitize input code to prevent XSS
        const sanitizedCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '// Script removed for security');
        
        // Use the shared Shiki service
        const html = await shikiService.highlight(sanitizedCode, language, theme);
        
        if (!cancelled) {
          // Sanitize the HTML output to prevent XSS
          const sanitizedHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['pre', 'code', 'span', 'div'],
            ALLOWED_ATTR: ['class', 'style', 'data-*'],
            KEEP_CONTENT: true,
          });
          setHighlightedCode(sanitizedHtml);
        }
      } catch (error) {
        console.error('Error highlighting code:', error);
        if (!cancelled) {
          // Fallback to plain text with proper escaping
          const escapeHtml = (text: string) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          };
          setHighlightedCode(`<pre><code>${escapeHtml(code)}</code></pre>`);
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
