import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/useTheme";
import { ClientOnly } from "./ClientOnly";

function ThemeToggleInner() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    console.log('Current theme:', theme);
    if (theme === 'light') {
      console.log('Switching to dark');
      setTheme('dark');
    } else {
      console.log('Switching to light');
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      title={getTitle()}
      className="h-8 w-8 p-0 hover:bg-background/50 transition-colors"
    >
      {getIcon()}
    </Button>
  );
}

export function ThemeToggle() {
  return (
    <ClientOnly fallback={
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-background/50 transition-colors"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    }>
      <ThemeToggleInner />
    </ClientOnly>
  );
}
