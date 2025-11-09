import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES } from '../constants/sizes';

interface CircularRadialMeterProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
}

export const CircularRadialMeter: React.FC<CircularRadialMeterProps> = ({
  value,
  min = 0,
  max = 120,
  size = SIZES.meterSize,
}) => {
  const { theme } = useTheme();
  const centerX = size / 2;
  const centerY = size / 2;
  const baseRadius = size / 3;

  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = (normalizedValue - min) / (max - min);

  // Generate radial lines
  const generateRadialLines = () => {
    const lines = [];
    const totalLines = 60;

    for (let i = 0; i < totalLines; i++) {
      const angle = (i / totalLines) * 360;
      const isActive = (i / totalLines) <= percentage;

      // Variable line length based on position
      const lengthVariation = Math.sin((i / totalLines) * Math.PI * 4) * 10;
      const lineLength = baseRadius + lengthVariation;

      const innerRadius = baseRadius - 30;
      const outerRadius = innerRadius + lineLength;

      const innerX = centerX + innerRadius * Math.cos((angle - 90) * (Math.PI / 180));
      const innerY = centerY + innerRadius * Math.sin((angle - 90) * (Math.PI / 180));
      const outerX = centerX + outerRadius * Math.cos((angle - 90) * (Math.PI / 180));
      const outerY = centerY + outerRadius * Math.sin((angle - 90) * (Math.PI / 180));

      const lineColor = isActive ? theme.wave : theme.border;
      const opacity = isActive ? 0.8 : 0.3;

      lines.push(
        <Line
          key={`radial-${i}`}
          x1={innerX}
          y1={innerY}
          x2={outerX}
          y2={outerY}
          stroke={lineColor}
          strokeWidth={2}
          opacity={opacity}
        />
      );
    }

    return lines;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Background circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={baseRadius + 20}
            fill="none"
            stroke={theme.border}
            strokeWidth={1}
            opacity={0.2}
          />

          {/* Radial lines */}
          {generateRadialLines()}

          {/* Inner circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={baseRadius - 40}
            fill={theme.card}
            opacity={0.9}
          />
        </G>
      </Svg>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: theme.text }]}>
          {Math.round(normalizedValue)}
        </Text>
        <Text style={[styles.unit, { color: theme.textSecondary }]}>dB</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
  },
  unit: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: -8,
  },
});
