import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES, SPACING } from '../constants/sizes';

interface StatsCardProps {
  min: number;
  avg: number;
  max: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ min, avg, max }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.statItem}>
        <Text style={[styles.value, { color: theme.text }]}>
          {Math.round(min)}
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Min</Text>
      </View>

      <View style={[styles.separator, { backgroundColor: theme.border }]} />

      <View style={styles.statItem}>
        <Text style={[styles.value, { color: theme.text }]}>
          {Math.round(avg)}
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Avg</Text>
      </View>

      <View style={[styles.separator, { backgroundColor: theme.border }]} />

      <View style={styles.statItem}>
        <Text style={[styles.value, { color: theme.primary }]}>
          {Math.round(max)}
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Max</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.margin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 40,
    marginHorizontal: SPACING.md,
  },
});
