import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email inválido');
      isValid = false;
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.devBadge, { backgroundColor: colors.warning, borderColor: colors.warning }]}>
            <Text style={styles.devBadgeText}>🔧 Modo Desarrollo</Text>
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>ZeroFinances</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Gestiona tus finanzas con Zero</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="admin@test.com"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Input
              label="Contraseña"
              placeholder="admin123"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry
              editable={!isLoading}
            />

            <Button
              title={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>

          <View style={[styles.testCredentials, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <Text style={[styles.testTitle, { color: colors.primary }]}>🧪 Credenciales de Prueba:</Text>
            <Text style={[styles.testText, { color: colors.text }]}>Email: <Text style={styles.testCode}>admin@test.com</Text></Text>
            <Text style={[styles.testText, { color: colors.text }]}>Contraseña: <Text style={styles.testCode}>admin123</Text></Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              ¿No tienes cuenta?{' '}
              <Text style={[styles.link, { color: colors.primary }]}>Regístrate aquí</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  devBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  devBadgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  testCredentials: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  testTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  testText: {
    fontSize: 12,
    marginBottom: 4,
  },
  testCode: {
    fontFamily: 'Courier New',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    borderRadius: 2,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: '600',
  },
});
