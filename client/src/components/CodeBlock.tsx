import { useEffect, useState } from 'react';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { useUserSettings } from '../hooks/useUserSettings';
import { cn } from '../lib/utils';
import { shikiService } from '../lib/shiki';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

interface CodeBlockProps {
  code: string;
  language: string;
  theme?: string;
  className?: string;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showExpandButton?: boolean;
  maxHeight?: string;
  lineNumbers?: boolean;
  rounded?: boolean;
  title?: string;
  hideScroll?: boolean;
}

export function CodeBlock({
  code,
  language,
  theme,
  className = '',
  showCopyButton = false,
  showDownloadButton = false,
  showExpandButton = false,
  maxHeight,
  rounded = true,
  title,
  hideScroll = false,
}: CodeBlockProps) {
  const { getEffectiveCodeTheme } = useUserSettings();
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeColors, setThemeColors] = useState({ bg: '', fg: '' });

  // Use theme prop if provided, otherwise use user's effective theme
  const activeTheme = theme || getEffectiveCodeTheme();

  // Sanitize the code to prevent XSS
  const sanitizedCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '// Script removed for security');

  useEffect(() => {
    let cancelled = false;

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        
        // Use the shared Shiki service
        const html = await shikiService.highlight(sanitizedCode, language, activeTheme);
        
        if (!cancelled) {
          // Sanitize the HTML output to prevent XSS
          const sanitizedHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['pre', 'code', 'span', 'div'],
            ALLOWED_ATTR: ['class', 'style', 'data-*'],
            KEEP_CONTENT: true,
          });
          setHighlightedCode(sanitizedHtml);
          
          // Get theme colors
          const colors = await shikiService.getThemeColors(activeTheme);
          setThemeColors(colors);
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
          setHighlightedCode(`<pre><code>${escapeHtml(sanitizedCode)}</code></pre>`);
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
  }, [sanitizedCode, language, activeTheme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  const downloadCode = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snippet.${language}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Code downloaded!');
    } catch (error) {
      console.error('Failed to download code:', error);
      toast.error('Failed to download code');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <div className={cn(
        'code-block',
        rounded && 'rounded-lg',
        'p-4 relative overflow-hidden bg-muted/30 border',
        className
      )}>
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
      <div className={cn(
        'code-block',
        rounded && 'rounded-lg',
        'p-4 relative overflow-hidden border',
        className
      )}>
        {(showCopyButton || showDownloadButton || showExpandButton) && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {showExpandButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                onClick={toggleExpand}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            {showDownloadButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                onClick={downloadCode}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {showCopyButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )}
        {title && (
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            {title}
          </div>
        )}
        <pre className={cn(
          'text-sm',
          'font-mono',
          'max-h-full',
          hideScroll ? 'overflow-hidden' : 'overflow-auto',
          rounded ? 'rounded-lg' : '',
          className
        )} style={{ backgroundColor: themeColors.bg, color: themeColors.fg }
        }>
          <code>{sanitizedCode}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={cn(
      'code-block',
      rounded && 'rounded-lg',
      'relative overflow-hidden border',
      isExpanded && 'fixed inset-4 z-50 bg-background',
      className
    )}>
      {(showCopyButton || showDownloadButton || showExpandButton) && (
        <div className="absolute top-2 right-6 flex gap-1 z-10">
          {showExpandButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
              onClick={toggleExpand}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          {showDownloadButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
              onClick={downloadCode}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      )}
      <div
        className={cn(
          // Single scroll container
          isExpanded ? 'overflow-auto' : (maxHeight ? 'overflow-auto' : 'overflow-x-auto'),
          '[&>pre]:!m-0',
          '[&>pre]:!p-4',
          '[&>pre]:!border-0',
          // Remove any scrolling from the pre element to avoid double scrollbars
          '[&>pre]:!overflow-visible',
          '[&>pre]:!white-space-pre',
          '[&>pre]:!word-break-normal'
        )}
        style={{
          ...((!isExpanded && maxHeight) ? { maxHeight } : {}),
          backgroundColor: themeColors.bg,
          color: themeColors.fg,
        }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
