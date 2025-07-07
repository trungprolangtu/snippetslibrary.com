import { useTheme } from '../hooks/useTheme';
import { ClientOnly } from './ClientOnly';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProviderInner({ children }: ThemeProviderProps) {
  useTheme(); // This hook applies the theme to the document
  return <>{children}</>;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background">{children}</div>}>
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </ClientOnly>
  );
}

export { ThemeProvider };
