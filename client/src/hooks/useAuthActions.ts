import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export function useAuthActions() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    try {
      await authLogout();
      toast.success('Successfully signed out!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed, but you have been signed out locally.');
      navigate('/');
    }
  };

  return { logout };
}
