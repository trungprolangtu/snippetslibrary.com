import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface LanguageBadgeProps {
  language: string;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export function LanguageBadge({ language, className, variant = 'secondary' }: LanguageBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        'text-xs font-medium',
        className
      )}
    >
      {language.charAt(0).toUpperCase() + language.slice(1)}
    </Badge>
  );
}
