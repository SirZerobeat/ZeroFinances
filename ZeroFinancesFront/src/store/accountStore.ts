import { create } from 'zustand';
import apiClient from '../api/client';

export interface Cuenta {
  id: string;
  nombre: string;
  tipo: string;
  saldo_actual: number;
}

interface AccountStore {
  cuentas: Cuenta[];
  isLoading: boolean;
  
  // Actions
  fetchCuentas: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  cuentas: [],
  isLoading: false,

  fetchCuentas: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/cuentas');
      set({ cuentas: response.data });
    } catch (error) {
      console.error('Fetch cuentas failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
