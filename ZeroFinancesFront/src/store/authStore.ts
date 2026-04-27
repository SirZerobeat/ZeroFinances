import { create } from 'zustand';
import apiClient from '../api/client';

interface User {
  id: string;
  nombre: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Connect to backend FastAPI
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, user_id, nombre } = response.data;

      const user: User = {
        id: user_id,
        nombre: nombre,
        email: email,
      };

      set({
        user,
        token,
        isAuthenticated: true
      });

      // Add token to default headers for future requests
      apiClient.defaults.headers.common['Authorization'] = `bearer ${token}`;

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    // Remove token from headers
    delete apiClient.defaults.headers.common['Authorization'];

    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setToken: (token: string) => {
    set({ token });
    // Add token to default headers
    apiClient.defaults.headers.common['Authorization'] = `bearer ${token}`;
  },
}));
