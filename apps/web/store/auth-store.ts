import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subscription?: {
    plan: 'free' | 'pro' | 'premium';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;

  // Token management
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;

  // User preferences
  updatePreferences: (preferences: Partial<User['preferences']>) => void;

  // Subscription management
  updateSubscription: (subscription: User['subscription']) => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,

        // Authentication Actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Login failed');
            }

            const { user, accessToken, refreshToken } = await response.json();

            set({
              user,
              isAuthenticated: true,
              token: accessToken,
              refreshToken,
              isLoading: false,
              error: null,
            });

            // Store tokens in localStorage for API client
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', accessToken);
              localStorage.setItem('refresh_token', refreshToken);
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Login failed',
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Registration failed');
            }

            const { user, accessToken, refreshToken } = await response.json();

            set({
              user,
              isAuthenticated: true,
              token: accessToken,
              refreshToken,
              isLoading: false,
              error: null,
            });

            // Store tokens in localStorage for API client
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', accessToken);
              localStorage.setItem('refresh_token', refreshToken);
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Registration failed',
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        logout: () => {
          // Clear tokens from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }

          // Make logout API call (fire and forget)
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${get().token}`,
            },
          }).catch(() => {
            // Ignore errors during logout
          });

          set({
            user: null,
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            error: null,
          });
        },

        refreshAuth: async () => {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          try {
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
              throw new Error('Token refresh failed');
            }

            const { accessToken, refreshToken: newRefreshToken, user } = await response.json();

            set({
              token: accessToken,
              refreshToken: newRefreshToken,
              user,
              isAuthenticated: true,
            });

            // Update tokens in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', accessToken);
              localStorage.setItem('refresh_token', newRefreshToken);
            }

            return accessToken;
          } catch (error) {
            // If refresh fails, logout user
            get().logout();
            throw error;
          }
        },

        updateUser: (userData: Partial<User>) => {
          const { user } = get();
          if (!user) return;

          set({
            user: {
              ...user,
              ...userData,
              updatedAt: new Date().toISOString(),
            },
          });
        },

        clearError: () => set({ error: null }),

        // Token Management
        setTokens: (accessToken: string, refreshToken: string) => {
          set({
            token: accessToken,
            refreshToken,
          });

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
          }
        },

        clearTokens: () => {
          set({
            token: null,
            refreshToken: null,
          });

          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
        },

        // User Preferences
        updatePreferences: (preferences: Partial<User['preferences']>) => {
          const { user } = get();
          if (!user) return;

          const updatedUser = {
            ...user,
            preferences: {
              ...user.preferences,
              ...preferences,
            },
            updatedAt: new Date().toISOString(),
          };

          set({ user: updatedUser });

          // Sync with backend
          fetch('/api/users/preferences', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().token}`,
            },
            body: JSON.stringify(preferences),
          }).catch(console.error);
        },

        // Subscription Management
        updateSubscription: (subscription: User['subscription']) => {
          const { user } = get();
          if (!user) return;

          set({
            user: {
              ...user,
              subscription,
              updatedAt: new Date().toISOString(),
            },
          });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
          refreshToken: state.refreshToken,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// Selectors for easier access
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
