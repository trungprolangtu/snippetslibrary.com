import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export function AuthHandler() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Check for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const errorStatus = urlParams.get('error');
    
    if (authStatus === 'success') {
      // Remove auth params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success toast
      toast.success('Successfully signed in!');
      
      // Don't redirect if already on dashboard
      if (window.location.pathname !== '/dashboard') {
        checkAuth().then(() => {
          // Redirect to dashboard after successful auth
          navigate('/dashboard');
        });
      } else {
        // Just check auth if already on dashboard
        checkAuth();
      }
    } else if (errorStatus) {
      // Handle auth error
      console.error('Authentication error:', errorStatus);
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show error toast
      const errorMessage = errorStatus === 'auth_failed' 
        ? 'Authentication failed. Please try again.' 
        : 'Invalid authentication request.';
      toast.error(errorMessage);
      
      // Redirect to home page on error
      navigate('/');
    }
  }, [navigate, checkAuth]);

  return null;
}
