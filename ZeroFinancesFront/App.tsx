import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTransactionStore } from './src/store/transactionStore';
import { useThemeStore } from './src/store/themeStore';
import { getThemeColors } from './src/utils/colors';

export default function App() {
  const { fetchTransacciones } = useTransactionStore();
  const { theme, loadTheme } = useThemeStore();

  useEffect(() => {
    // Cargar tema guardado al iniciar
    loadTheme();
    // Cargar transacciones al iniciar
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
