import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, login, logout as apiLogout, removeToken, type AuthUser } from '../services/api';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const isAdminUser = (user: AuthUser | null | undefined) =>
  user?.roles.includes('ROLE_ADMIN') ?? false;

export const getDefaultDashboardPath = (user: AuthUser | null | undefined) =>
  isAdminUser(user) ? '/admin/dashboard' : '/dashboard';

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

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          removeToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
