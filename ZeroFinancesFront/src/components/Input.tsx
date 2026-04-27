import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  ...props
}) => {
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: error ? '#ff3333' : colors.inputBorder,
            color: colors.text,
          }
        ]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: 4,
  },
});
