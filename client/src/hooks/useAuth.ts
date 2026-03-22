import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  logout as apiLogout,
  getCurrentUser,
  removeToken,
  setStoredUser,
  type AuthUser,
} from '../services/api';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiLogout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      setUser: (user) => {
        setStoredUser(user);
        set({ user, isAuthenticated: true, error: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          removeToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
