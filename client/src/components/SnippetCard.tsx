import { Clock, Eye, EyeOff, MoreHorizontal, Edit, Trash2, Copy, Share2, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ValidatedInput, ValidatedTextarea } from './ValidatedInput';
import { ValidationRules } from '../lib/validation';
import { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { LanguageBadge } from './LanguageBadge';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ShareDialog } from './ShareDialog';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import type { Snippet } from 'shared';

interface SnippetCardProps {
  snippet: Snippet;
  onUpdate: () => void;
}

export function SnippetCard({ snippet, onUpdate }: SnippetCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: snippet.title,
    description: snippet.description || '',
    code: snippet.code,
    language: snippet.language,
    isPublic: snippet.isPublic
  });

  // Available programming languages
  const languages = [
    'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust',
    'php', 'ruby', 'swift', 'kotlin', 'scala', 'dart', 'elixir', 'haskell', 'lua',
    'perl', 'r', 'julia', 'clojure', 'fsharp', 'ocaml', 'erlang', 'elm', 'reason',
    'purescript', 'nix', 'dhall', 'toml', 'yaml', 'json', 'xml', 'html', 'css',
    'scss', 'sass', 'less', 'stylus', 'sql', 'bash', 'sh', 'zsh', 'fish',
    'powershell', 'batch', 'dockerfile', 'makefile', 'cmake', 'ninja', 'bazel',
    'text', 'markdown', 'mdx', 'tex', 'latex', 'bibtex', 'org', 'rst', 'asciidoc'
  ];

  // Reset form when snippet changes or modal opens
  const resetForm = () => {
    setEditForm({
      title: snippet.title,
      description: snippet.description || '',
      code: snippet.code,
      language: snippet.language,
      isPublic: snippet.isPublic
    });
    setIsEditing(false);
  };

  // Handle opening detail modal
  const handleOpenDetail = () => {
    resetForm();
    setIsDetailOpen(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!editForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!editForm.code.trim()) {
      toast.error('Code is required');
      return;
    }

    setIsSaving(true);
    try {
      await api.snippets.update(snippet.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        code: editForm.code,
        language: editForm.language,
        isPublic: editForm.isPublic
      });
      toast.success('Snippet updated successfully!');
      setIsEditing(false);
      setIsDetailOpen(false);
      onUpdate();
    } catch {
      toast.error('Failed to update snippet');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast.success('Code copied to clipboard!');
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.snippets.delete(snippet.id);
      toast.success('Snippet deleted successfully!');
      setIsDeleteOpen(false);
      onUpdate();
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateCode = (code: string, maxLines: number = 4) => {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">
                {snippet.title}
              </h3>
              {snippet.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {snippet.description}
                </p>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleOpenDetail}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsShareOpen(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="bg-muted/30 rounded-md mb-4">
            <CodeBlock
              code={truncateCode(snippet.code)}
              language={snippet.language}
              className="text-xs"
              hideScroll={true}
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2">
              <LanguageBadge language={snippet.language} />
              {snippet.isPublic ? (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">Public</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <EyeOff className="h-3 w-3" />
                  <span className="text-xs">Private</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{formatDate(snippet.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenDetail}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-2" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0 overflow-hidden dialog-content">
          <div className="flex flex-col h-full max-h-[95vh]">
            <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h2 className="scroll-m-20 text-xl font-semibold tracking-tight break-words max-w-[300px] sm:max-w-none snippet-title">
                    {isEditing ? 'Edit Snippet' : snippet.title}
                  </h2>
                  {!isEditing && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <LanguageBadge language={snippet.language} />
                      {snippet.isPublic ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <EyeOff className="h-3 w-3" />
                          <span className="text-xs">Private</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 dialog-actions sm:pr-8">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsShareOpen(true)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>
                {isEditing ? 'Edit your code snippet details and content.' : 'View and interact with your code snippet.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Details */}
                      <div className="space-y-4">
                        <ValidatedInput
                          id="title"
                          label="Title"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter snippet title"
                          rules={[
                            ValidationRules.required(),
                            ValidationRules.maxLength(255),
                            ValidationRules.noScript(),
                          ]}
                          helpText="A descriptive title for your code snippet"
                        />
                        
                        <ValidatedTextarea
                          id="description"
                          label="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter snippet description (optional)"
                          className="min-h-[100px] resize-none"
                          rules={[
                            ValidationRules.maxLength(1000),
                            ValidationRules.noScript(),
                          ]}
                          helpText="Optional description to explain what your code does"
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select
                              value={editForm.language}
                              onValueChange={(value) => setEditForm(prev => ({ ...prev, language: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {languages.map((lang) => (
                                  <SelectItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="visibility">Visibility</Label>
                            <div className="flex items-center gap-2 h-9">
                              <Switch
                                id="visibility"
                                checked={editForm.isPublic}
                                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isPublic: checked }))}
                              />
                              <span className="text-sm text-muted-foreground">
                                {editForm.isPublic ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Code Preview */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Live Preview</Label>
                          <div className="rounded-lg overflow-hidden border bg-muted/10">
                            <CodeBlock
                              code={editForm.code || '// No code yet'}
                              language={editForm.language}
                              maxHeight="300px"
                              showCopyButton={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Width Code Editor */}
                    <ValidatedTextarea
                      id="code"
                      label="Code"
                      value={editForm.code}
                      onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Enter your code here"
                      className="min-h-[400px] font-mono text-sm resize-none"
                      rules={[
                        ValidationRules.required(),
                        ValidationRules.maxLength(100000, 'Code must be less than 100KB'),
                        ValidationRules.noScript(),
                      ]}
                      helpText="Your code snippet - supports syntax highlighting for the selected language"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {snippet.description && (
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <div className="bg-muted/30 p-4 rounded-lg max-h-[200px] overflow-y-auto">
                          <p className="leading-7 text-muted-foreground break-words whitespace-pre-wrap snippet-description hyphens-auto">
                            {snippet.description}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Created {formatDate(snippet.createdAt)}</span>
                      </div>
                      {snippet.updatedAt && snippet.updatedAt !== snippet.createdAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Updated {formatDate(snippet.updatedAt)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Code</Label>
                      <div className="rounded-lg overflow-hidden border">
                        <CodeBlock
                          code={snippet.code}
                          language={snippet.language}
                          showCopyButton={true}
                          showDownloadButton={true}
                          showExpandButton={true}
                          maxHeight="600px"
                          title={`${snippet.title} - ${snippet.language}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
