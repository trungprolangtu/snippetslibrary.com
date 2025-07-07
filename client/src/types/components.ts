// Component-specific types and interfaces

// ValidatedInput component types
export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rules?: ValidationRule[];
  onValidationChange?: (isValid: boolean) => void;
  showError?: boolean;
  helpText?: string;
}

export interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  rules?: ValidationRule[];
  onValidationChange?: (isValid: boolean) => void;
  showError?: boolean;
  helpText?: string;
}

// ThemeProvider component types
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}

// SyntaxHighlighter component types
export interface SyntaxHighlighterProps {
  code: string;
  language: string;
  theme?: string;
  className?: string;
}

// StatsCard component types
export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

// SnippetCard component types
export interface SnippetCardProps {
  snippet: Snippet;
  showUser?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

// ShareDialog component types
export interface ShareDialogProps {
  snippet: Snippet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// LanguageBadge component types
export interface LanguageBadgeProps {
  language: string;
  variant?: 'default' | 'secondary' | 'outline';
}

// DeleteConfirmation component types
export interface DeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

// CreateSnippetForm component types
export interface CreateSnippetFormProps {
  onSubmit: (data: CreateSnippetFormData) => void;
  initialData?: Partial<CreateSnippetFormData>;
}

export interface CreateSnippetFormData {
  title: string;
  description: string;
  code: string;
  language: string;
  isPublic: boolean;
}

// CodeBlock component types
export interface CodeBlockProps {
  code: string;
  language: string;
  theme?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

// Import ValidationRule type from shared
import type { ValidationRule, Snippet } from 'shared';
