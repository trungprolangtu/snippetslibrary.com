// UI-specific types and interfaces

// Common UI component props
export interface BaseUIProps {
  className?: string;
  children?: React.ReactNode;
}

// Button variants
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Badge variants
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// Alert variants
export type AlertVariant = 'default' | 'destructive';

// Card variants
export type CardVariant = 'default' | 'elevated' | 'outlined';

// Input variants
export type InputVariant = 'default' | 'destructive';

// Select variants
export type SelectVariant = 'default' | 'destructive';

// Theme-related types
export type Theme = 'light' | 'dark' | 'system';
export type CodeTheme = 'github-light' | 'github-dark' | 'vs-dark' | 'vs-light' | 'auto';

// Common size types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common spacing types
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Animation types
export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

// Position types
export type Position = 'top' | 'bottom' | 'left' | 'right';
export type Alignment = 'start' | 'center' | 'end';

// Responsive breakpoints
export interface ResponsiveBreakpoints {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}
