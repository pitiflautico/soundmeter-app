import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { TabBarIcon } from '../components/TabBarIcon';
import { TabParamList } from '../types';
import { SIZES } from '../constants/sizes';

// Import screens (we'll create these next)
import { DosimeterScreen } from '../screens/DosimeterScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { DataScreen } from '../screens/DataScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dosimeter"
        component={DosimeterScreen}
        options={{
          title: 'Dosimeter',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="dosimeter" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Data"
        component={DataScreen}
        options={{
          title: 'Data',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="data" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
