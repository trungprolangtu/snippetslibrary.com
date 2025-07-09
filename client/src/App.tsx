import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';
import { ThemeProvider } from './components/ThemeProvider';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthHandler } from './components/AuthHandler';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { shikiService } from './lib/shiki';

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const SnippetDetail = lazy(() => import('./pages/SnippetDetail').then(module => ({ default: module.SnippetDetail })));
const SharedSnippet = lazy(() => import('./pages/SharedSnippet').then(module => ({ default: module.SharedSnippet })));
const AccountSettings = lazy(() => import('./pages/AccountSettings').then(module => ({ default: module.AccountSettings })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));

// Preload components that users are likely to need
const preloadComponents = () => {
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback to avoid blocking main thread
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    idleCallback(() => {
      // Preload components during idle time
      import('./components/CodeBlock');
      import('./components/SyntaxHighlighter');
    });
  }
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LandingPage />
        </Suspense>
      } />
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
      <Route path="/terms" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Terms />
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
    
    // Cleanup function to properly dispose of Shiki instance
    return () => {
      // Clean up the Shiki service on app unmount
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          shikiService.dispose();
        });
      }
    };
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <UserSettingsProvider>
              <ThemeProvider>
                <div className="min-h-screen bg-background flex flex-col overflow-hidden supports-[overflow:clip]:overflow-clip" suppressHydrationWarning>
                  <AuthHandler />
                  <AppRoutes />
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      className: 'bg-card text-card-foreground border',
                    }}
                  />
                </div>
              </ThemeProvider>
            </UserSettingsProvider>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
