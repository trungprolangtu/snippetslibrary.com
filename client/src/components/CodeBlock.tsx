import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from 'shiki';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { useUserSettings } from '../contexts/UserSettingsContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

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
}

// Create a mapping for language aliases and ensure we have fallbacks
const getLanguageForShiki = (language: string): string => {
  // Common language mappings for Shiki
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'csharp': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'markdown': 'markdown',
    'bash': 'bash',
    'shell': 'bash',
    'sql': 'sql',
    'xml': 'xml',
    'text': 'text',
    'txt': 'text',
  };
  
  return languageMap[language.toLowerCase()] || 'text';
};

// Map theme names to valid Shiki themes
const getValidShikiTheme = (themeName: string): string => {
  // Theme mapping for commonly used themes
  const themeMap: Record<string, string> = {
    'auto': 'github-dark', // fallback
    'dark-plus': 'dark-plus',
    'light-plus': 'light-plus',
    'github-dark': 'github-dark',
    'github-light': 'github-light',
    'github-dark-dimmed': 'github-dark-dimmed',
    'monokai': 'monokai',
    'dracula': 'dracula',
    'one-dark-pro': 'one-dark-pro',
    'one-light': 'one-light',
    'nord': 'nord',
    'tokyo-night': 'tokyo-night',
    'material-theme': 'material-theme',
    'catppuccin-mocha': 'catppuccin-mocha',
    'catppuccin-latte': 'catppuccin-latte',
    'rose-pine': 'rose-pine',
    'synthwave-84': 'synthwave-84',
    'poimandres': 'poimandres',
    'night-owl': 'night-owl',
    'solarized-dark': 'solarized-dark',
    'solarized-light': 'solarized-light',
  };
  
  return themeMap[themeName.toLowerCase()] || 'github-dark';
};

// Create a singleton highlighter instance to avoid recreating it
let globalHighlighter: Highlighter | null = null;

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
        
        // Get the correct language identifier for Shiki
        const shikiLanguage = getLanguageForShiki(language);
        
        // Get the valid Shiki theme
        const validTheme = getValidShikiTheme(activeTheme);
        
        // Initialize highlighter if not already done
        if (!globalHighlighter) {
          globalHighlighter = await createHighlighter({
            themes: ['dark-plus', 'light-plus', 'github-dark', 'github-light'], // Load common themes
            langs: ['javascript', 'typescript', 'python', 'text'], // Load common languages + text fallback
          });
        }

        // Check if the language is already loaded
        const loadedLanguages = globalHighlighter.getLoadedLanguages();
        
        if (!loadedLanguages.includes(shikiLanguage)) {
          // Try to dynamically load the language
          try {
            await globalHighlighter.loadLanguage(shikiLanguage as BundledLanguage);
          } catch (langError) {
            console.warn(`Failed to load language '${shikiLanguage}', falling back to 'text':`, langError);
            // If the language fails to load, try to load 'text' as fallback
            if (!loadedLanguages.includes('text')) {
              try {
                await globalHighlighter.loadLanguage('text');
              } catch (textError) {
                console.warn('Failed to load text language, using plain text:', textError);
              }
            }
          }
        }

        // Check if the theme is already loaded
        const loadedThemes = globalHighlighter.getLoadedThemes();
        
        if (!loadedThemes.includes(validTheme)) {
          try {
            await globalHighlighter.loadTheme(validTheme as BundledTheme);
          } catch (themeError) {
            console.warn(`Failed to load theme '${validTheme}', falling back to default:`, themeError);
            // Try to load a default theme as fallback
            if (!loadedThemes.includes('github-dark')) {
              try {
                await globalHighlighter.loadTheme('github-dark');
              } catch (fallbackError) {
                console.warn('Failed to load fallback theme:', fallbackError);
              }
            }
          }
        }

        if (!cancelled) {
          // Determine which language to use for highlighting
          const currentLoadedLanguages = globalHighlighter.getLoadedLanguages();
          const langToUse = currentLoadedLanguages.includes(shikiLanguage) ? shikiLanguage : 
                           currentLoadedLanguages.includes('text') ? 'text' : 'txt';
          
          // Determine which theme to use for highlighting
          const currentLoadedThemes = globalHighlighter.getLoadedThemes();
          const themeToUse = currentLoadedThemes.includes(validTheme) ? validTheme : 
                            currentLoadedThemes.includes('github-dark') ? 'github-dark' : 
                            currentLoadedThemes[0] || 'github-dark';
          
          const html = globalHighlighter.codeToHtml(sanitizedCode, {
            lang: langToUse,
            theme: themeToUse,
          });
          setHighlightedCode(html);
          
          // Extract theme colors from the highlighter
          const themeData = globalHighlighter.getTheme(themeToUse);
          const bg = themeData.colors?.['editor.background'] || themeData.bg || '#ffffff';
          const fg = themeData.colors?.['editor.foreground'] || themeData.fg || '#000000';
          setThemeColors({ bg, fg });
        }
      } catch (error) {
        console.error('Error highlighting code:', error);
        if (!cancelled) {
          setHighlightedCode(`<pre><code>${sanitizedCode}</code></pre>`);
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
        <pre className="text-sm font-mono overflow-auto max-h-full">
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
