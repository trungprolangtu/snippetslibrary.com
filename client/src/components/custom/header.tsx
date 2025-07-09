import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export default function Header({ handleLogin, isLoading }: {
  handleLogin: () => Promise<void>;
  isLoading: boolean;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      handleLogin();
    }
  };

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-background/20 px-3 backdrop-blur-lg before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
        >
          {/* Site branding */}
          <div className="flex flex-1 items-center min-w-0">
            <img src="/favicon.svg" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
            <div className="flex flex-col gap-0 space-y-0 ml-2 min-w-0">
              <span className="text-base sm:text-lg font-semibold text-foreground m-0 p-0 truncate">
                Snippets Library
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground hidden lg:block m-0 p-0 truncate">
                Store, organize, and share your code snippets with ease
              </p>
            </div>
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <ThemeToggle />
            </li>
            <li>
              <Button
                className="btn-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary/80 text-xs sm:text-sm px-3 sm:px-4"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (user ? "Go to Dashboard" : "Get Started")}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
