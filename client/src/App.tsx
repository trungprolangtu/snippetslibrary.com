import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';
import { ThemeProvider } from './components/ThemeProvider';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const SnippetDetail = lazy(() => import('./pages/SnippetDetail').then(module => ({ default: module.SnippetDetail })));
const SharedSnippet = lazy(() => import('./pages/SharedSnippet').then(module => ({ default: module.SharedSnippet })));
const AccountSettings = lazy(() => import('./pages/AccountSettings').then(module => ({ default: module.AccountSettings })));

// Preload components that users are likely to need
const preloadComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload components after a short delay to not block initial render
    setTimeout(() => {
      import('./components/CodeBlock');
      import('./components/SyntaxHighlighter');
    }, 2000);
  }
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : (
        <Suspense fallback={<LoadingSpinner />}>
          <LandingPage />
        </Suspense>
      )} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <AccountSettings />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/snippet/:id" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <SnippetDetail />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/share/:shareId" element={
        <Suspense fallback={<LoadingSpinner />}>
          <SharedSnippet />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  // Preload components after initial render
  useEffect(() => {
    preloadComponents();
  }, []);

  return (
    <AuthProvider>
      <UserSettingsProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background" suppressHydrationWarning>
              <AppRoutes />
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'bg-card text-card-foreground border',
                }}
              />
            </div>
          </Router>
        </ThemeProvider>
      </UserSettingsProvider>
    </AuthProvider>
  );
}

export default App;
