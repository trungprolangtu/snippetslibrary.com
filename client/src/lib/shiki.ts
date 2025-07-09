import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from 'shiki';

class ShikiService {
  private static instance: ShikiService;
  private highlighter: Highlighter | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ShikiService {
    if (!ShikiService.instance) {
      ShikiService.instance = new ShikiService();
    }
    return ShikiService.instance;
  }

  async getHighlighter(): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (!this.initPromise) {
      this.initPromise = this.initializeHighlighter();
    }

    await this.initPromise;
    return this.highlighter!;
  }

  private async initializeHighlighter(): Promise<void> {
    this.highlighter = await createHighlighter({
      themes: [
        'dark-plus',
        'light-plus',
        'github-dark',
        'github-light',
        'github-dark-dimmed',
        'monokai',
        'dracula',
        'one-dark-pro',
        'one-light',
        'nord',
        'tokyo-night',
        'catppuccin-mocha',
        'catppuccin-latte',
        'rose-pine',
        'synthwave-84',
        'poimandres',
        'night-owl',
        'solarized-dark',
        'solarized-light',
      ],
      langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'cpp',
        'c',
        'csharp',
        'go',
        'rust',
        'php',
        'ruby',
        'html',
        'css',
        'scss',
        'json',
        'markdown',
        'bash',
        'sql',
        'xml',
        'text',
      ],
    });
  }

  async highlight(code: string, language: string, theme: string): Promise<string> {
    const highlighter = await this.getHighlighter();
    
    // Get the correct language identifier for Shiki
    const shikiLanguage = this.getLanguageForShiki(language);
    
    // Get the valid Shiki theme
    const validTheme = this.getValidShikiTheme(theme);
    
    // Check if the language is already loaded
    const loadedLanguages = highlighter.getLoadedLanguages();
    if (!loadedLanguages.includes(shikiLanguage)) {
      try {
        await highlighter.loadLanguage(shikiLanguage as BundledLanguage);
      } catch (error) {
        console.warn(`Failed to load language '${shikiLanguage}', falling back to 'text':`, error);
        // If the language fails to load, try to load 'text' as fallback
        if (!loadedLanguages.includes('text')) {
          try {
            await highlighter.loadLanguage('text');
          } catch (textError) {
            console.warn('Failed to load text language, using plain text:', textError);
          }
        }
      }
    }

    // Check if the theme is already loaded
    const loadedThemes = highlighter.getLoadedThemes();
    if (!loadedThemes.includes(validTheme)) {
      try {
        await highlighter.loadTheme(validTheme as BundledTheme);
      } catch (error) {
        console.warn(`Failed to load theme '${validTheme}', falling back to default:`, error);
        // Try to load a default theme as fallback
        if (!loadedThemes.includes('github-dark')) {
          try {
            await highlighter.loadTheme('github-dark');
          } catch (fallbackError) {
            console.warn('Failed to load fallback theme:', fallbackError);
          }
        }
      }
    }

    // Determine which language to use for highlighting
    const currentLoadedLanguages = highlighter.getLoadedLanguages();
    const langToUse = currentLoadedLanguages.includes(shikiLanguage) ? shikiLanguage : 
                     currentLoadedLanguages.includes('text') ? 'text' : 'txt';
    
    // Determine which theme to use for highlighting
    const currentLoadedThemes = highlighter.getLoadedThemes();
    const themeToUse = currentLoadedThemes.includes(validTheme) ? validTheme : 
                      currentLoadedThemes.includes('github-dark') ? 'github-dark' : 
                      currentLoadedThemes[0] || 'github-dark';
    
    return highlighter.codeToHtml(code, {
      lang: langToUse,
      theme: themeToUse,
    });
  }

  async getThemeColors(theme: string): Promise<{ bg: string; fg: string }> {
    const highlighter = await this.getHighlighter();
    const validTheme = this.getValidShikiTheme(theme);
    
    // Ensure theme is loaded
    const loadedThemes = highlighter.getLoadedThemes();
    if (!loadedThemes.includes(validTheme)) {
      try {
        await highlighter.loadTheme(validTheme as BundledTheme);
      } catch (error) {
        console.warn(`Failed to load theme '${validTheme}', falling back to default:`, error);
      }
    }
    
    const currentLoadedThemes = highlighter.getLoadedThemes();
    const themeToUse = currentLoadedThemes.includes(validTheme) ? validTheme : 
                      currentLoadedThemes.includes('github-dark') ? 'github-dark' : 
                      currentLoadedThemes[0] || 'github-dark';
    
    const themeData = highlighter.getTheme(themeToUse);
    const bg = themeData.colors?.['editor.background'] || themeData.bg || '#ffffff';
    const fg = themeData.colors?.['editor.foreground'] || themeData.fg || '#000000';
    
    return { bg, fg };
  }

  private getLanguageForShiki(language: string): string {
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
  }

  private getValidShikiTheme(themeName: string): string {
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
  }

  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
      this.initPromise = null;
    }
  }
}

export const shikiService = ShikiService.getInstance();
