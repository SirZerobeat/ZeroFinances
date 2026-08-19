import { useEffect, useRef } from 'react';
import { useAccountStore } from '../store/accountStore';
import { useTransactionStore } from '../store/transactionStore';

// Determine backend URL from environment or fallback to localhost
const BASE_WS_URL = process.env.EXPO_PUBLIC_API_URL 
  ? process.env.EXPO_PUBLIC_API_URL.replace('http://', 'ws://').replace('https://', 'wss://')
  : 'ws://localhost:8000/api/v1';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const fetchCuentas = useAccountStore((state) => state.fetchCuentas);
  const fetchTransacciones = useTransactionStore((state) => state.fetchTransacciones);

  useEffect(() => {
    const wsUrl = `${BASE_WS_URL}/ws`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'BALANCE_UPDATE') {
          // When a new transaction is processed, we refetch data
          fetchCuentas();
          fetchTransacciones();
        }
      } catch (err) {
        console.error('Error parsing WS message', err);
      }
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket Error:', e.message || 'Unknown error');
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, [fetchCuentas, fetchTransacciones]);

  return ws.current;
}
