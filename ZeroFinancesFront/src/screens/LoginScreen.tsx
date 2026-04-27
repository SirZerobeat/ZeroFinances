import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading } = useAuthStore();

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
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.devBadge}>
        <Text style={styles.devBadgeText}>🔧 Modo Desarrollo</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>ZeroFinances</Text>
        <Text style={styles.subtitle}>Gestiona tus finanzas con Zero</Text>
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

      <View style={styles.testCredentials}>
        <Text style={styles.testTitle}>🧪 Credenciales de Prueba:</Text>
        <Text style={styles.testText}>Email: <Text style={styles.testCode}>admin@test.com</Text></Text>
        <Text style={styles.testText}>Contraseña: <Text style={styles.testCode}>admin123</Text></Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.link}>Regístrate aquí</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#fff',
  },
  devBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  devBadgeText: {
    color: '#856404',
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
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  testCredentials: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  testTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  testText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  testCode: {
    fontFamily: 'Courier New',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    borderRadius: 2,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
