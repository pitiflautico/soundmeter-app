import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES } from '../constants/sizes';

interface CircularMeterProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
}

export const CircularMeter: React.FC<CircularMeterProps> = ({
  value,
  min = 0,
  max = 120,
  size = SIZES.meterSize,
}) => {
  const { theme } = useTheme();
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 40;

  // Normalize value to angle (240 degrees total arc, from -120 to +120)
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = (normalizedValue - min) / (max - min);
  const angle = -120 + percentage * 240;

  // Calculate needle endpoint
  const needleLength = radius - 20;
  const needleX = centerX + needleLength * Math.cos((angle - 90) * (Math.PI / 180));
  const needleY = centerY + needleLength * Math.sin((angle - 90) * (Math.PI / 180));

  // Generate scale marks
  const generateMarks = () => {
    const marks = [];
    const totalMarks = 13;

    for (let i = 0; i < totalMarks; i++) {
      const markAngle = -120 + (i / (totalMarks - 1)) * 240;
      const markValue = min + (i / (totalMarks - 1)) * (max - min);
      const isMainMark = i % 3 === 0;
      const markLength = isMainMark ? 15 : 8;

      const outerX = centerX + radius * Math.cos((markAngle - 90) * (Math.PI / 180));
      const outerY = centerY + radius * Math.sin((markAngle - 90) * (Math.PI / 180));
      const innerX = centerX + (radius - markLength) * Math.cos((markAngle - 90) * (Math.PI / 180));
      const innerY = centerY + (radius - markLength) * Math.sin((markAngle - 90) * (Math.PI / 180));

      marks.push(
        <Line
          key={`mark-${i}`}
          x1={innerX}
          y1={innerY}
          x2={outerX}
          y2={outerY}
          stroke={theme.textSecondary}
          strokeWidth={isMainMark ? 2 : 1}
        />
      );

      if (isMainMark) {
        const labelX = centerX + (radius + 25) * Math.cos((markAngle - 90) * (Math.PI / 180));
        const labelY = centerY + (radius + 25) * Math.sin((markAngle - 90) * (Math.PI / 180));
        const labelValue = Math.round(markValue);

        marks.push(
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            fill={theme.textSecondary}
            fontSize="12"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {labelValue}
          </text>
        );
      }
    }

    return marks;
  };

  // Color based on value
  const getNeedleColor = () => {
    if (normalizedValue < 60) return theme.accent;
    if (normalizedValue < 85) return '#FFA726';
    return theme.primary;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Scale marks */}
          {generateMarks()}

          {/* Center circle */}
          <Circle cx={centerX} cy={centerY} r={8} fill={theme.border} />

          {/* Needle */}
          <Line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke={getNeedleColor()}
            strokeWidth={4}
            strokeLinecap="round"
          />

          {/* Center dot */}
          <Circle cx={centerX} cy={centerY} r={6} fill={getNeedleColor()} />
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
    bottom: 60,
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
