import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  Linking,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { AdBanner } from '../components/AdBanner';
import { SIZES, SPACING } from '../constants/sizes';
import { storageService } from '../services/StorageService';

export const SettingsScreen = () => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings } = useSettings();

  const handleHapticFeedback = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleToggleAlerts = async (value: boolean) => {
    await handleHapticFeedback();
    updateSettings({ enableAlerts: value });
  };

  const handleToggleHaptic = async (value: boolean) => {
    if (value) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateSettings({ hapticFeedback: value });
  };

  const handleCalibration = () => {
    handleHapticFeedback();
    Alert.alert(
      'Calibration',
      'Enter calibration offset in decibels (-20 to +20):',
      [
        {
          text: 'Reset',
          onPress: () => updateSettings({ calibrationOffset: 0 }),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
        {
          text: '-5 dB',
          onPress: () => updateSettings({ calibrationOffset: -5 }),
        },
        {
          text: '+5 dB',
          onPress: () => updateSettings({ calibrationOffset: 5 }),
        },
      ]
    );
  };

  const handleShare = async () => {
    await handleHapticFeedback();
    try {
      await Share.share({
        message:
          'Check out Sound Meter - A professional sound level meter app for iOS and Android!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = async () => {
    await handleHapticFeedback();
    Alert.alert(
      'Rate App',
      'Would you like to rate Sound Meter on the App Store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            // In production, this would open the App Store/Play Store
            Alert.alert('Thank you!', 'This would open the app store.');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    handleHapticFeedback();
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all saved measurements? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearAllReadings();
            Alert.alert('Success', 'All measurements have been deleted.');
          },
        },
      ]
    );
  };

  const handleThemeChange = () => {
    handleHapticFeedback();
    Alert.alert('Theme', 'Choose your preferred theme:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Light',
        onPress: () => setThemeMode('light'),
      },
      {
        text: 'Dark',
        onPress: () => setThemeMode('dark'),
      },
      {
        text: 'Auto',
        onPress: () => setThemeMode('auto'),
      },
    ]);
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon?: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: theme.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        {icon && (
          <View
            style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Text style={[styles.arrow, { color: theme.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Sound Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            SOUND SETTINGS
          </Text>

          <SettingRow
            icon="🔊"
            title="Enable Alerts"
            subtitle="Get notified when noise levels exceed safe limits"
            rightElement={
              <Switch
                value={settings.enableAlerts}
                onValueChange={handleToggleAlerts}
                trackColor={{ false: theme.inactive, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />

          <SettingRow
            icon="📳"
            title="Haptic Feedback"
            subtitle="Vibration feedback for interactions"
            rightElement={
              <Switch
                value={settings.hapticFeedback}
                onValueChange={handleToggleHaptic}
                trackColor={{ false: theme.inactive, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />

          <SettingRow
            icon="⚙️"
            title="Calibration"
            subtitle={`Offset: ${settings.calibrationOffset > 0 ? '+' : ''}${settings.calibrationOffset} dB`}
            onPress={handleCalibration}
          />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            APPEARANCE
          </Text>

          <SettingRow
            icon="🎨"
            title="Theme"
            subtitle={`Current: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}`}
            onPress={handleThemeChange}
          />
        </View>

        {/* App */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            APP
          </Text>

          <SettingRow
            icon="📤"
            title="Share App"
            subtitle="Share Sound Meter with friends"
            onPress={handleShare}
          />

          <SettingRow
            icon="⭐"
            title="Rate App"
            subtitle="Help us improve with your feedback"
            onPress={handleRate}
          />

          <SettingRow
            icon="🗑️"
            title="Clear All Data"
            subtitle="Delete all saved measurements"
            onPress={handleClearData}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ABOUT
          </Text>

          <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.appName, { color: theme.text }]}>Sound Meter</Text>
            <Text style={[styles.version, { color: theme.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              A professional sound level meter app for measuring environmental noise
              levels accurately.
            </Text>
          </View>
        </View>

        {/* Ad Banner */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.tiny,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: SIZES.padding,
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SIZES.padding,
    marginHorizontal: SIZES.margin,
    marginBottom: SPACING.sm,
    borderRadius: SIZES.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: SIZES.small,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  aboutCard: {
    marginHorizontal: SIZES.margin,
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appName: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: SIZES.small,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: SIZES.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  adContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
});
