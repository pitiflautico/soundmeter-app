import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface LineChartProps {
  data: number[];
  height?: number;
  showGrid?: boolean;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  showGrid = true,
}) => {
  const { theme } = useTheme();

  if (data.length === 0) {
    return <View style={[styles.container, { height }]} />;
  }

  const maxValue = Math.max(...data, 120);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  const stepX = CHART_WIDTH / (data.length - 1 || 1);

  const getY = (value: number) => {
    return height - ((value - minValue) / range) * height;
  };

  const generatePath = () => {
    let path = `M 0 ${getY(data[0])}`;

    data.forEach((value, index) => {
      if (index > 0) {
        const x = index * stepX;
        const y = getY(value);
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const generateGridLines = () => {
    const lines = [];
    const gridCount = 5;

    for (let i = 0; i <= gridCount; i++) {
      const y = (height / gridCount) * i;
      const value = maxValue - (range / gridCount) * i;

      lines.push(
        <G key={`grid-${i}`}>
          <Line
            x1={0}
            y1={y}
            x2={CHART_WIDTH}
            y2={y}
            stroke={theme.border}
            strokeWidth={1}
            strokeDasharray="5,5"
            opacity={0.3}
          />
          <SvgText
            x={-5}
            y={y + 4}
            fill={theme.textSecondary}
            fontSize="10"
            textAnchor="end"
          >
            {Math.round(value)}
          </SvgText>
        </G>
      );
    }

    return lines;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={CHART_WIDTH + 30} height={height}>
        <G x={30} y={0}>
          {showGrid && generateGridLines()}

          {/* Path */}
          <Path
            d={generatePath()}
            fill="none"
            stroke={theme.chart}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((value, index) => {
            const x = index * stepX;
            const y = getY(value);

            return (
              <Circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r={3}
                fill={theme.chart}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
});
