import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('Google Mobile Ads initialized');
      })
      .catch((error) => {
        console.error('Error initializing Google Mobile Ads:', error);
      });
  }, []);

  return (
    <ThemeProvider>
      <SettingsProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SettingsProvider>
    </ThemeProvider>
  );
}
