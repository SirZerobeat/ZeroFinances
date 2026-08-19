import { create } from 'zustand';
import apiClient from '../api/client';

export interface Transaccion {
  id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  categoria: string;
  comercio: string;
  fecha: Date;
  descripcion?: string;
}

interface TransactionStore {
  transacciones: Transaccion[];
  isLoading: boolean;

  // Actions
  fetchTransacciones: () => Promise<void>;
  addTransaccion: (transaccion: Transaccion) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transacciones: [],
  isLoading: false,

  fetchTransacciones: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/transacciones');
      const data = response.data.map((t: any) => ({
        id: t.id,
        tipo: t.tipo,
        monto: t.monto,
        categoria: t.categoria_trans_id ? String(t.categoria_trans_id) : 'General',
        comercio: t.comercio || 'Desconocido',
        fecha: new Date(t.fecha_transaccion),
        descripcion: t.descripcion
      }));
      set({ transacciones: data });
    } catch (error) {
      console.error('Fetch transacciones failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaccion: (transaccion: Transaccion) => {
    set((state) => ({
      transacciones: [...state.transacciones, transaccion]
    }));
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
