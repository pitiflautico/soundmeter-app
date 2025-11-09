import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { AdBanner } from '../components/AdBanner';
import { useInterstitialAd } from '../hooks/useInterstitialAd';
import { SIZES, SPACING } from '../constants/sizes';

export const CameraScreen = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { show: showInterstitial, loaded: interstitialLoaded } = useInterstitialAd();
  const [captureCount, setCaptureCount] = useState(0);

  const handleHapticFeedback = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleCapture = async () => {
    await handleHapticFeedback();

    // Show interstitial ad every 3 captures
    if (captureCount > 0 && captureCount % 3 === 0 && interstitialLoaded) {
      showInterstitial();
    }

    setCaptureCount(prev => prev + 1);

    Alert.alert(
      'Capture Sound Level',
      'This feature allows you to capture and save the current sound level with a photo or note.',
      [{ text: 'OK' }]
    );
  };

  const handleGallery = async () => {
    await handleHapticFeedback();

    Alert.alert(
      'Sound Gallery',
      'View all your captured sound measurements with photos and notes.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Camera</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={[styles.cameraPreview, { backgroundColor: theme.card }]}>
            <View style={styles.cameraPlaceholder}>
              <Text style={[styles.cameraIcon, { color: theme.textSecondary }]}>
                📷
              </Text>
              <Text style={[styles.cameraText, { color: theme.textSecondary }]}>
                Camera Preview
              </Text>
              <Text style={[styles.cameraSubtext, { color: theme.textSecondary }]}>
                Capture sound levels with visual context
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              📸 Sound Snapshot
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Capture the current sound level along with a photo to document noisy
              environments, construction sites, or any location where you need visual
              proof of sound levels.
            </Text>
          </View>

          {/* Features List */}
          <View style={[styles.featuresCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.featuresTitle, { color: theme.text }]}>
              Features
            </Text>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Real-time Capture
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  Capture sound levels instantly with photo
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📝</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Add Notes
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  Include descriptions and location details
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💾</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Save & Export
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  Save captures and export with reports
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleGallery}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                📁 Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.captureButton, { backgroundColor: theme.primary }]}
              onPress={handleCapture}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                📷 Capture
              </Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: SIZES.margin,
  },
  cameraPreview: {
    height: 300,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  cameraIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  cameraText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  cameraSubtext: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  infoCard: {
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: SIZES.body,
    lineHeight: 22,
  },
  featuresCard: {
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: SIZES.small,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  captureButton: {
    flex: 1.5,
    borderWidth: 0,
  },
  buttonText: {
    fontSize: SIZES.h4,
    fontWeight: '700',
  },
  adContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
});
