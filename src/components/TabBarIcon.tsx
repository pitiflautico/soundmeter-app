import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface TabBarIconProps {
  name: 'dosimeter' | 'camera' | 'data' | 'settings';
  color: string;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  color,
  size = 24,
}) => {
  const renderIcon = () => {
    switch (name) {
      case 'dosimeter':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <Circle cx="12" cy="12" r="2" fill={color} />
            <Path
              d="M12 2 L12 6"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M12 18 L12 22"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M4.22 4.22 L7.05 7.05"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M16.95 16.95 L19.78 19.78"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'camera':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" fill="none" />
          </Svg>
        );

      case 'data':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M3 3v18h18"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M18 17l-5-5-3 3-4-4"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="18" cy="17" r="1.5" fill={color} />
            <Circle cx="13" cy="12" r="1.5" fill={color} />
            <Circle cx="10" cy="15" r="1.5" fill={color} />
            <Circle cx="6" cy="11" r="1.5" fill={color} />
          </Svg>
        );

      case 'settings':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
            <Path
              d="M12 1v6m0 6v10M1 12h6m6 0h10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M4.22 4.22l4.24 4.24m7.07 7.07l4.24 4.24M19.78 4.22l-4.24 4.24m-7.07 7.07l-4.24 4.24"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
