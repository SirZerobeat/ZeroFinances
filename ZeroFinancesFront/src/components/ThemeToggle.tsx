import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const colors = getThemeColors(theme);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.icon, { color: colors.text }]}>
        {theme === 'light' ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    fontSize: 20,
  },
});
