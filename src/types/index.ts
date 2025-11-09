export interface AudioReading {
  id: string;
  timestamp: number;
  decibels: number;
  min: number;
  max: number;
  avg: number;
  duration: number;
}

export interface Settings {
  enableAlerts: boolean;
  alertThreshold: number;
  hapticFeedback: boolean;
  calibrationOffset: number;
  theme: 'light' | 'dark' | 'auto';
  chartType: 'wave' | 'circular' | 'bar';
}

export interface MeterData {
  current: number;
  min: number;
  max: number;
  avg: number;
  history: number[];
}

export type RootStackParamList = {
  MainTabs: undefined;
};

export type TabParamList = {
  Dosimeter: undefined;
  Camera: undefined;
  Data: undefined;
  Settings: undefined;
};

export const ADMOB_IDS = {
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
};
