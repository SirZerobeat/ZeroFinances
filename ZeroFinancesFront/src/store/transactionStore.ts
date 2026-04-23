import { create } from 'zustand';

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
      // TODO: Conectar con el backend FastAPI
      // const response = await axios.get('http://localhost:8000/transacciones');
      // set({ transacciones: response.data });

      // Mock para desarrollo
      set({
        transacciones: [
          {
            id: '1',
            tipo: 'egreso',
            monto: 450,
            categoria: 'Alimentos',
            comercio: 'KFC',
            fecha: new Date(),
            descripcion: 'Comida'
          }
        ]
      });
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
