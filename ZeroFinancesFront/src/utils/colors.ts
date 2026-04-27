import { Theme } from '../store/themeStore';

export const colors = {
  light: {
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#f0f0f0',
    primary: '#007AFF',
    primaryDark: '#0051D5',
    danger: '#ff3333',
    success: '#4CAF50',
    warning: '#ffc107',
    input: '#f9f9f9',
    inputBorder: '#ddd',
    header: '#ffffff',
    headerText: '#333333',
  },
  dark: {
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    border: '#3a3a3a',
    primary: '#5ba3ff',
    primaryDark: '#4a8ce0',
    danger: '#ff6b6b',
    success: '#66bb6a',
    warning: '#ffb300',
    input: '#3a3a3a',
    inputBorder: '#4a4a4a',
    header: '#2d2d2d',
    headerText: '#ffffff',
  },
};

export const getThemeColors = (theme: Theme) => colors[theme];
