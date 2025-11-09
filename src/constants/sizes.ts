import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  // Window dimensions
  width,
  height,

  // Padding & Margin
  padding: 20,
  margin: 16,
  radius: 16,
  borderRadius: 12,

  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  small: 14,
  tiny: 12,

  // Icon sizes
  icon: 24,
  iconLarge: 32,
  iconSmall: 20,

  // Meter sizes
  meterSize: Math.min(width * 0.7, 300),
  meterStroke: 8,

  // Tab bar
  tabBarHeight: 80,
  tabIconSize: 28,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
