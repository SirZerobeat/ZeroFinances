import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',

  setTheme: async (theme: Theme) => {
    try {
      await AsyncStorage.setItem('app-theme', theme);
      set({ theme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    await get().setTheme(newTheme);
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        set({ theme: savedTheme });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  },
}));
