import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface WaveformViewProps {
  data: number[];
  height?: number;
}

const { width } = Dimensions.get('window');

export const WaveformView: React.FC<WaveformViewProps> = ({
  data,
  height = 200,
}) => {
  const { theme } = useTheme();

  const generatePath = () => {
    if (data.length === 0) return '';

    const maxValue = Math.max(...data, 1);
    const stepX = width / (data.length - 1 || 1);

    let path = `M 0 ${height / 2}`;

    data.forEach((value, index) => {
      const x = index * stepX;
      const normalizedValue = (value / maxValue) * (height / 2);
      const y = height / 2 - normalizedValue;
      path += ` L ${x} ${y}`;
    });

    // Mirror path for symmetry
    for (let i = data.length - 1; i >= 0; i--) {
      const x = i * stepX;
      const normalizedValue = (data[i] / maxValue) * (height / 2);
      const y = height / 2 + normalizedValue;
      path += ` L ${x} ${y}`;
    }

    path += ' Z';
    return path;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        {/* Center line */}
        <Line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={theme.border}
          strokeWidth={1}
          strokeDasharray="5,5"
        />

        {/* Waveform */}
        <Path d={generatePath()} fill={theme.wave} opacity={0.3} />
        <Path d={generatePath()} fill="none" stroke={theme.wave} strokeWidth={2} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
