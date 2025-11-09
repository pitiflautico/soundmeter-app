import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { CircularMeter } from '../components/CircularMeter';
import { CircularRadialMeter } from '../components/CircularRadialMeter';
import { WaveformView } from '../components/WaveformView';
import { BarMeter } from '../components/BarMeter';
import { LineChart } from '../components/LineChart';
import { StatsCard } from '../components/StatsCard';
import { AdBanner } from '../components/AdBanner';
import { audioService } from '../services/AudioService';
import { storageService } from '../services/StorageService';
import { SIZES, SPACING } from '../constants/sizes';
import { AudioReading, MeterData } from '../types';

export const DosimeterScreen = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const [isRecording, setIsRecording] = useState(false);
  const [meterData, setMeterData] = useState<MeterData>({
    current: 0,
    min: 0,
    max: 0,
    avg: 0,
    history: [],
  });
  const [chartData, setChartData] = useState<number[]>([]);
  const [viewType, setViewType] = useState<'circular' | 'radial' | 'wave' | 'bar'>('circular');
  const startTimeRef = useRef<number>(0);
  const readingsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && settings.enableAlerts && meterData.current >= settings.alertThreshold) {
      if (settings.hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }, [meterData.current, settings.enableAlerts, settings.alertThreshold, settings.hapticFeedback]);

  const startRecording = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const started = await audioService.startMonitoring((db) => {
      const calibratedDb = db + settings.calibrationOffset;
      readingsRef.current.push(calibratedDb);

      const min = Math.min(...readingsRef.current);
      const max = Math.max(...readingsRef.current);
      const avg =
        readingsRef.current.reduce((a, b) => a + b, 0) / readingsRef.current.length;

      setMeterData({
        current: calibratedDb,
        min,
        max,
        avg,
        history: [...readingsRef.current],
      });

      // Update chart data (keep last 50 points)
      setChartData((prev) => {
        const newData = [...prev, calibratedDb];
        if (newData.length > 50) {
          newData.shift();
        }
        return newData;
      });
    });

    if (started) {
      setIsRecording(true);
      startTimeRef.current = Date.now();
      readingsRef.current = [];
    } else {
      Alert.alert(
        'Permission Required',
        'Microphone permission is required to measure sound levels.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopRecording = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    await audioService.stopMonitoring();
    setIsRecording(false);

    // Save reading to storage
    if (readingsRef.current.length > 0) {
      const reading: AudioReading = {
        id: Date.now().toString(),
        timestamp: startTimeRef.current,
        decibels: meterData.current,
        min: meterData.min,
        max: meterData.max,
        avg: meterData.avg,
        duration: Date.now() - startTimeRef.current,
      };

      await storageService.saveReading(reading);
    }
  };

  const resetMeter = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isRecording) {
      await stopRecording();
    }

    setMeterData({
      current: 0,
      min: 0,
      max: 0,
      avg: 0,
      history: [],
    });
    setChartData([]);
    readingsRef.current = [];
  };

  const toggleViewType = async () => {
    if (settings.hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const types: Array<'circular' | 'radial' | 'wave' | 'bar'> = ['circular', 'radial', 'wave', 'bar'];
    const currentIndex = types.indexOf(viewType);
    const nextIndex = (currentIndex + 1) % types.length;
    setViewType(types[nextIndex]);
  };

  const renderMeter = () => {
    switch (viewType) {
      case 'circular':
        return <CircularMeter value={meterData.current} />;
      case 'radial':
        return <CircularRadialMeter value={meterData.current} />;
      case 'wave':
        return (
          <View style={styles.waveContainer}>
            <WaveformView data={chartData} height={250} />
            <View style={styles.waveValue}>
              <Text style={[styles.waveValueText, { color: theme.text }]}>
                {Math.round(meterData.current)}
              </Text>
              <Text style={[styles.waveValueUnit, { color: theme.textSecondary }]}>
                dB
              </Text>
            </View>
          </View>
        );
      case 'bar':
        return (
          <View style={styles.barContainer}>
            <BarMeter value={meterData.current} height={250} />
            <View style={styles.barValue}>
              <Text style={[styles.barValueText, { color: theme.text }]}>
                {Math.round(meterData.current)}
              </Text>
              <Text style={[styles.barValueUnit, { color: theme.textSecondary }]}>
                dB
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Sound Meter</Text>
          <TouchableOpacity onPress={toggleViewType} style={styles.switchButton}>
            <Text style={[styles.switchButtonText, { color: theme.primary }]}>
              Switch View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meter */}
        <View style={styles.meterContainer}>{renderMeter()}</View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard min={meterData.min} avg={meterData.avg} max={meterData.max} />
        </View>

        {/* Chart */}
        {chartData.length > 0 && (
          <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>
              Real-time Graph
            </Text>
            <LineChart data={chartData} height={150} showGrid={true} />
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonSecondary,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={resetMeter}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              {
                backgroundColor: isRecording ? theme.primary : theme.accent,
              },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {isRecording ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
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
  switchButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  switchButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  meterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  waveContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  waveValue: {
    position: 'absolute',
    alignItems: 'center',
  },
  waveValueText: {
    fontSize: 48,
    fontWeight: '700',
  },
  waveValueUnit: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: -8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  barValue: {
    alignItems: 'center',
  },
  barValueText: {
    fontSize: 48,
    fontWeight: '700',
  },
  barValueUnit: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: -8,
  },
  statsContainer: {
    marginBottom: SPACING.lg,
  },
  chartCard: {
    marginHorizontal: SIZES.margin,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    flex: 2,
  },
  buttonSecondary: {
    borderWidth: 2,
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
