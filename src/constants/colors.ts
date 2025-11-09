export const lightTheme = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#FF5252',
  primaryLight: '#FF8A80',
  accent: '#00C853',
  accentLight: '#69F0AE',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  chart: '#00C853',
  gradient: ['#FF5252', '#FF8A80'],
  wave: '#00C853',
  bar: '#00C853',
  inactive: '#BDBDBD',
};

export const darkTheme = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  primary: '#FF5252',
  primaryLight: '#FF8A80',
  accent: '#00C853',
  accentLight: '#69F0AE',
  border: '#333333',
  shadow: 'rgba(0, 0, 0, 0.5)',
  chart: '#00C853',
  gradient: ['#FF5252', '#FF8A80'],
  wave: '#FFFFFF',
  bar: '#FFFFFF',
  inactive: '#555555',
};

export type Theme = typeof lightTheme;
