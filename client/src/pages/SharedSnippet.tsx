import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Code2, User, Clock, Eye, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CodeBlock } from '../components/CodeBlock';
import { LanguageBadge } from '../components/LanguageBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEOHead } from '../components/SEOHeadSSR';
import { useAuth } from '../contexts/AuthContext';
import { useUserSettings } from '../hooks/useUserSettings';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import type { Snippet } from 'shared';

export function SharedSnippet() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings: userSeoSettings } = useUserSettings();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedSnippet = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.snippets.getByShareId(shareId!);
        setSnippet(data.snippet);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Snippet not found or no longer available';
        setError(message);
        console.error('Error fetching shared snippet:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedSnippet();
    }
  }, [shareId]);

  // Generate SEO metadata
  const generateSEOData = () => {
    if (!snippet) return {};

    const baseTitle = snippet.title;
    const baseDescription = snippet.description || 'A shared code snippet';
    const author = snippet.user?.username || 'Anonymous';
    const language = snippet.language;
    const codeLines = snippet.code.split('\n').length;
    const readTime = Math.max(1, Math.ceil(codeLines / 10)); // Estimate reading time

    // Prefer user SEO settings if available, then snippet, then fallback
    const seoTitle = userSeoSettings.seoTitle?.trim()
      ? `${baseTitle} - ${userSeoSettings.seoTitle}`
      : snippet.seoTitle
        ? `${baseTitle} - ${snippet.seoTitle}`
        : `${baseTitle} - ${language.toUpperCase()} Code Snippet by ${author} on Snippets Library`;

    let seoDescription = userSeoSettings.seoDescription?.trim()
      ? userSeoSettings.seoDescription
      : snippet.seoDescription || baseDescription;
    if (!userSeoSettings.seoDescription && !snippet.seoDescription) {
      seoDescription = `${baseDescription} - A ${language} code snippet with ${codeLines} lines of code, shared by ${author}. Features syntax highlighting, easy copying, and clean formatting. Perfect for developers and programmers.`;
    }

    const keywordArray = [
      language,
      `${language} code`,
      `${language} snippet`,
      `${language} example`,
      'code snippet',
      'programming',
      'developer',
      'software development',
      'coding',
      'source code',
      'code sharing',
      'development tools',
      ...(snippet.tags || []),
      ...(userSeoSettings.seoKeywords ? userSeoSettings.seoKeywords.split(',').map(k => k.trim()) : []),
      ...(snippet.seoKeywords ? snippet.seoKeywords.split(',').map(k => k.trim()) : []),
      ...(snippet.user?.seoKeywords ? snippet.user.seoKeywords.split(',').map(k => k.trim()) : [])
    ];
    const seoKeywords = [...new Set(keywordArray)].filter(Boolean).join(', ');

    const seoImage = userSeoSettings.seoImageUrl?.trim() || snippet.seoImageUrl || snippet.user?.seoImageUrl || snippet.user?.avatarUrl || '/icons/web-app-manifest-512x512.png';
    const twitterHandle = snippet.user?.socialLinks?.twitter ? `@${snippet.user.socialLinks.twitter.split('/').pop()}` : '@snippetslibrary';

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
      image: seoImage,
      author,
      twitterHandle,
      publishedTime: snippet.createdAt.toString(),
      modifiedTime: snippet.updatedAt.toString(),
      type: 'article' as const,
      codeLanguage: language,
      category: 'Programming',
      tags: snippet.tags || [],
      readTime,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Shared Snippets', url: '/share' },
        { name: snippet.title, url: `/share/${shareId}` }
      ]
    };
  };

  const seoData = generateSEOData();

  const copyToClipboard = async () => {
    if (!snippet) return;
    
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to copy code';
      toast.error(message);
    }
  };

  const copyToDashboard = async () => {
    if (!snippet || !user) return;
    
    try {
      await api.snippets.create({
        title: `Copy of ${snippet.title}`,
        description: snippet.description ?? undefined,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags || [],
        isPublic: false,
      });
      toast.success('Snippet copied to your dashboard!');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to copy snippet';
      toast.error(message);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Code2 className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Snippet Not Found</h2>
          <p className="text-muted-foreground">
            {error || 'This snippet may have been deleted or is no longer available.'}
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Snippets Library</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToDashboard}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Copy to Dashboard
                </Button>
              )}
              
              {!user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Snippet Header */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl">{snippet.title}</CardTitle>
              {snippet.description && (
                <p className="text-lg text-muted-foreground">
                  {snippet.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm">
                <LanguageBadge language={snippet.language} />
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>by {snippet.user?.username || 'Anonymous'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(snippet.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Public</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Code */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{snippet.language}</CardTitle>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CodeBlock
                code={snippet.code}
                language={snippet.language}
                className="text-sm"
                showCopyButton={false}
                rounded={false}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Created with ❤️ using Snippets Library
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Create Your Own Snippets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
