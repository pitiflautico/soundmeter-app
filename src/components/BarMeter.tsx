import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BarMeterProps {
  value: number;
  max?: number;
  height?: number;
}

export const BarMeter: React.FC<BarMeterProps> = ({
  value,
  max = 120,
  height = 300,
}) => {
  const { theme } = useTheme();
  const barCount = 40;
  const normalizedValue = Math.max(0, Math.min(max, value));
  const percentage = normalizedValue / max;
  const activeBars = Math.round(barCount * percentage);

  const getBarColor = (index: number) => {
    const barPercentage = (index + 1) / barCount;
    if (barPercentage < 0.5) return theme.accent;
    if (barPercentage < 0.7) return '#FFA726';
    return theme.primary;
  };

  return (
    <View style={[styles.container, { height }]}>
      {Array.from({ length: barCount }).map((_, index) => {
        const reverseIndex = barCount - 1 - index;
        const isActive = reverseIndex < activeBars;

        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: isActive
                  ? getBarColor(reverseIndex)
                  : theme.border,
                opacity: isActive ? 1 : 0.3,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bar: {
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
});
