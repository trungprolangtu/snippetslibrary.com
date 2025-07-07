import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../lib/languages';
import type { CreateSnippetFormProps } from '../types';

export function CreateSnippetForm({ onSubmit }: CreateSnippetFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    isPublic: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        isPublic: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = SUPPORTED_LANGUAGES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter snippet title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this snippet does..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {LANGUAGE_LABELS[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code *</Label>
        <Textarea
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Paste your code here..."
          rows={12}
          className="font-mono"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
          className="flex items-center gap-2"
        >
          {formData.isPublic ? (
            <>
              <Eye className="h-4 w-4" />
              Public
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Private
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Snippet'}
          </Button>
        </div>
      </div>
    </form>
  );
}
