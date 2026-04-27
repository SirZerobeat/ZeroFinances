import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LoginScreen } from '../screens/LoginScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ExcelScreen } from '../screens/ExcelScreen';
import { ThemeToggle } from '../components/ThemeToggle';

import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.header,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.headerText,
        headerTitleStyle: {
          color: colors.headerText,
          fontWeight: '600',
        },
        headerRight: () => <ThemeToggle />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat con Zero',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendario',
          tabBarLabel: 'Calendario',
        }}
      />
      <Tab.Screen
        name="Excel"
        component={ExcelScreen}
        options={{
          title: 'Generar Excel',
          tabBarLabel: 'Excel',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.headerText,
          headerTitleStyle: {
            color: colors.headerText,
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
