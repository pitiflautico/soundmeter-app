import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { AdBanner } from '../components/AdBanner';
import { useRewardedAd } from '../hooks/useRewardedAd';
import { storageService } from '../services/StorageService';
import { SIZES, SPACING } from '../constants/sizes';
import { AudioReading } from '../types';

export const DataScreen = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const [readings, setReadings] = useState<AudioReading[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const { show: showRewardedAd, loaded: rewardedAdLoaded } = useRewardedAd(() => {
    exportData();
  });

  useFocusEffect(
    useCallback(() => {
      loadReadings();
    }, [])
  );

  const loadReadings = async () => {
    const data = await storageService.getReadings();
    setReadings(data);
  };

  const handleHapticFeedback = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDelete = (reading: AudioReading) => {
    handleHapticFeedback();
    Alert.alert(
      'Delete Measurement',
      'Are you sure you want to delete this measurement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteReading(reading.id);
            await loadReadings();
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    await handleHapticFeedback();

    if (readings.length === 0) {
      Alert.alert('No Data', 'There are no measurements to export.');
      return;
    }

    if (rewardedAdLoaded) {
      Alert.alert(
        'Export Data',
        'Watch a short ad to export your data to CSV format.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Watch Ad',
            onPress: () => showRewardedAd(),
          },
        ]
      );
    } else {
      exportData();
    }
  };

  const exportData = async () => {
    setIsExporting(true);

    try {
      // Generate CSV content
      let csv = 'Date,Time,Duration (s),Min (dB),Avg (dB),Max (dB),Current (dB)\n';

      readings.forEach((reading) => {
        const date = new Date(reading.timestamp);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        const duration = (reading.duration / 1000).toFixed(1);

        csv += `${dateStr},${timeStr},${duration},${reading.min.toFixed(1)},${reading.avg.toFixed(
          1
        )},${reading.max.toFixed(1)},${reading.decibels.toFixed(1)}\n`;
      });

      // In a real app, we would save this to a file and share it
      // For now, we'll just show an alert
      Alert.alert(
        'Export Complete',
        `Successfully exported ${readings.length} measurements.\n\nIn a production app, this would save a CSV file and allow you to share it.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getColorForDb = (db: number) => {
    if (db < 60) return theme.accent;
    if (db < 85) return '#FFA726';
    return theme.primary;
  };

  const renderReading = ({ item }: { item: AudioReading }) => (
    <TouchableOpacity
      style={[styles.readingCard, { backgroundColor: theme.card }]}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.readingHeader}>
        <View>
          <Text style={[styles.readingDate, { color: theme.text }]}>
            {formatDate(item.timestamp)}
          </Text>
          <Text style={[styles.readingTime, { color: theme.textSecondary }]}>
            {formatTime(item.timestamp)} · {formatDuration(item.duration)}
          </Text>
        </View>
        <View
          style={[
            styles.readingValue,
            { backgroundColor: getColorForDb(item.max) + '20' },
          ]}
        >
          <Text style={[styles.readingValueText, { color: getColorForDb(item.max) }]}>
            {Math.round(item.max)}
          </Text>
          <Text style={[styles.readingValueUnit, { color: getColorForDb(item.max) }]}>
            dB
          </Text>
        </View>
      </View>

      <View style={styles.readingStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {Math.round(item.min)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Min</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {Math.round(item.avg)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avg</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {Math.round(item.max)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Max</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No measurements yet
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Start recording to see your data here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Measurements</Text>
        <TouchableOpacity
          style={[
            styles.exportButton,
            { backgroundColor: theme.primary },
            isExporting && styles.exportButtonDisabled,
          ]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text style={styles.exportButtonText}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      {readings.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            Total Measurements
          </Text>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>
            {readings.length}
          </Text>
        </View>
      )}

      {/* Readings List */}
      <FlatList
        data={readings}
        renderItem={renderReading}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
      />

      {/* Ad Banner */}
      <View style={styles.adContainer}>
        <AdBanner />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
  },
  exportButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.borderRadius / 2,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  summaryCard: {
    marginHorizontal: SIZES.margin,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: SIZES.h1,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SIZES.margin,
    paddingBottom: SPACING.xl,
  },
  readingCard: {
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  readingDate: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  readingTime: {
    fontSize: SIZES.small,
  },
  readingValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.borderRadius / 2,
  },
  readingValueText: {
    fontSize: SIZES.h3,
    fontWeight: '700',
  },
  readingValueUnit: {
    fontSize: SIZES.small,
    fontWeight: '600',
    marginLeft: 2,
  },
  readingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: SIZES.tiny,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: SIZES.body,
  },
  adContainer: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
});
