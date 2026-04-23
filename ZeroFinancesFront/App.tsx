import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-screens';
import 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTransactionStore } from './src/store/transactionStore';

export default function App() {
  const { fetchTransacciones } = useTransactionStore();

  useEffect(() => {
    // Cargar transacciones al iniciar
    fetchTransacciones();
  }, []);

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
