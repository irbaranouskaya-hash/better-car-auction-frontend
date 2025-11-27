import { create } from 'zustand';
import { User } from '@/types/user.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage with safe parsing
  const getStoredUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
      return null;
    }
  };

  const storedUser = getStoredUser();
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  return {
    user: storedUser,
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    isAuthenticated: !!storedAccessToken && !!storedUser,
    
    setAuth: (user, accessToken, refreshToken) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },
    
    updateUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    },
  };
});

