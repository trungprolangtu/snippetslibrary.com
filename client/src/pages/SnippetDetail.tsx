import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Code2, Clock, Eye, EyeOff, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CodeBlock } from '../components/CodeBlock';
import { LanguageBadge } from '../components/LanguageBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { ShareDialog } from '../components/ShareDialog';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import type { Snippet } from 'shared';
import { SEOHead } from '../components/SEOHeadSSR';

export function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.snippets.getById(id!);
        setSnippet(data.snippet);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Snippet not found';
        setError(message);
        console.error('Error fetching snippet:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSnippet();
    }
  }, [id]);

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

  const handleDelete = async () => {
    if (!snippet) return;
    
    setIsDeleting(true);
    try {
      await api.snippets.delete(snippet.id);
      toast.success('Snippet deleted successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateShareLink = async (snippetId: string) => {
    try {
      const response = await api.snippets.share(snippetId);
      return response.shareId;
    } catch {
      throw new Error('Failed to generate share link');
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate SEO data for snippet detail
  const generateSEOData = () => {
    if (!snippet) return {};

    const codeLines = snippet.code.split('\n').length;
    const readTime = Math.max(1, Math.ceil(codeLines / 10));

    return {
      title: `${snippet.title} - ${snippet.language.toUpperCase()} Code Snippet`,
      description: snippet.description || `A ${snippet.language} code snippet with ${codeLines} lines of code. Perfect for developers and programmers.`,
      keywords: `${snippet.language}, ${snippet.language} code, code snippet, programming, developer, ${snippet.tags?.join(', ') || ''}`,
      type: 'article' as const,
      codeLanguage: snippet.language,
      category: 'Programming',
      tags: snippet.tags || [],
      readTime,
      noIndex: !snippet.isPublic, // Only index public snippets
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Dashboard', url: '/dashboard' },
        { name: snippet.title, url: `/snippet/${id}` }
      ]
    };
  };

  const seoData = generateSEOData();

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
            {error || 'This snippet may have been deleted or you may not have permission to view it.'}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Code2 className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Snippets Library</span>
              </div>
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareOpen(true)}
              >
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Navigate to edit */}}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
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
                  {snippet.isPublic ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Private</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(snippet.createdAt)}</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{snippet.language}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CodeBlock
                code={snippet.code}
                language={snippet.language}
                showCopyButton={true}
                rounded={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title={snippet.title}
        loading={isDeleting}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        snippet={snippet}
        onGenerateShareLink={handleGenerateShareLink}
      />
    </div>
  );
}
