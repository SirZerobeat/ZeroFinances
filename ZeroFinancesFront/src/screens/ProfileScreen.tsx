import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';
import { Button } from '../components/Button';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const colors = getThemeColors(theme);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={[styles.nombre, { color: colors.text }]}>{user?.nombre || 'Usuario'}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'email@ejemplo.com'}</Text>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Personal</Text>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.nombre || 'No especificado'}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.email || 'No especificado'}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>ID Usuario</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.id || 'No asignado'}</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Configuración</Text>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Notificaciones</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Activadas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Tema</Text>
          <Text style={[styles.settingValue, { color: colors.primary, fontWeight: '700' }]}>{theme === 'light' ? 'Claro' : 'Oscuro'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Moneda</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>MXN ($)</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acerca de</Text>
        <View style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Versión de la app</Text>
          <Text style={[styles.value, { color: colors.text }]}>1.0.0</Text>
        </View>
        <TouchableOpacity style={[styles.aboutLink, { borderBottomColor: colors.border }]}>
          <Text style={[styles.aboutLinkText, { color: colors.primary }]}>Términos de Servicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.aboutLink, { borderBottomColor: colors.border }]}>
          <Text style={[styles.aboutLinkText, { color: colors.primary }]}>Política de Privacidad</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Cerrar sesión"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  nombre: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 14,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
  },
});
