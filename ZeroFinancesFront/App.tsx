import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTransactionStore } from './src/store/transactionStore';
import { useAccountStore } from './src/store/accountStore';
import { useThemeStore } from './src/store/themeStore';
import { getThemeColors } from './src/utils/colors';
import { useWebSocket } from './src/hooks/useWebSocket';

export default function App() {
  const { fetchTransacciones } = useTransactionStore();
  const { fetchCuentas } = useAccountStore();
  const { theme, loadTheme } = useThemeStore();

  useWebSocket();

  useEffect(() => {
    // Cargar tema guardado al iniciar
    loadTheme();
    // Cargar transacciones y cuentas al iniciar
    fetchCuentas();
    fetchTransacciones();
  }, []);

  const colors = getThemeColors(theme);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <RootNavigator />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.header} />
      </View>
    </SafeAreaProvider>
  );
}
