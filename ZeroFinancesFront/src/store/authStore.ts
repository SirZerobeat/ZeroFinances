import { create } from 'zustand';

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
      // TODO: Conectar con el backend FastAPI
      // const response = await axios.post('http://localhost:8000/auth/login', { email, password });
      // const { user, token } = response.data;

      // Mock para desarrollo
      const mockUser: User = {
        id: '1',
        nombre: 'Usuario',
        email: email,
      };

      set({
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
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
  },
}));
