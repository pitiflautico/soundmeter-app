# Sound Meter App

A professional sound level meter application built with React Native and Expo for iOS and Android.

## Features

- ✅ **Real-time Sound Measurement**: Measure environmental noise levels in real-time
- ✅ **Multiple Visualization Modes**:
  - Circular analog meter
  - Radial meter with animated lines
  - Waveform visualization
  - Vertical bar meter
- ✅ **Data Tracking**: Save and export measurement history
- ✅ **Statistics**: Min, Max, and Average sound level tracking
- ✅ **100% Offline**: All data stored locally, no internet required
- ✅ **Google AdMob Integration**: Banner, Interstitial, and Rewarded ads
- ✅ **Customizable Settings**:
  - Sound alerts
  - Haptic feedback
  - Calibration offset
  - Theme selection (Light/Dark/Auto)
- ✅ **Cross-platform**: Works on iOS and Android
- ✅ **Beautiful UI**: Clean, modern interface with dark mode support

## Technology Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Expo AV** - Audio recording and metering
- **AsyncStorage** - Local data persistence
- **Google Mobile Ads** - Monetization
- **Expo Haptics** - Tactile feedback
- **React Native SVG** - Custom graphics

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd soundmeter-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### Using Expo Go (Recommended for testing)

1. Install Expo Go app on your iOS or Android device
2. Run `npm start`
3. Scan the QR code with your device

### Building Development Client (Required for AdMob)

Since AdMob requires native code, you need to build a development client:

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

## Project Structure

```
soundmeter-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdBanner.tsx
│   │   ├── BarMeter.tsx
│   │   ├── CircularMeter.tsx
│   │   ├── CircularRadialMeter.tsx
│   │   ├── LineChart.tsx
│   │   ├── StatsCard.tsx
│   │   ├── TabBarIcon.tsx
│   │   └── WaveformView.tsx
│   ├── constants/          # App constants
│   │   ├── colors.ts
│   │   └── sizes.ts
│   ├── contexts/           # React contexts
│   │   ├── SettingsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useInterstitialAd.ts
│   │   └── useRewardedAd.ts
│   ├── navigation/         # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/            # App screens
│   │   ├── CameraScreen.tsx
│   │   ├── DataScreen.tsx
│   │   ├── DosimeterScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # Business logic
│   │   ├── AudioService.ts
│   │   └── StorageService.ts
│   └── types/              # TypeScript types
│       └── index.ts
├── App.tsx                 # Entry point
└── app.json               # Expo configuration
```

## Configuration

### AdMob Setup

The app uses test AdMob IDs by default. To use your own ads:

1. Create an AdMob account at https://admob.google.com
2. Create ad units for:
   - Banner Ad
   - Interstitial Ad
   - Rewarded Ad
3. Update the IDs in `src/types/index.ts`:

```typescript
export const ADMOB_IDS = {
  ios: {
    banner: 'your-ios-banner-id',
    interstitial: 'your-ios-interstitial-id',
    rewarded: 'your-ios-rewarded-id',
  },
  android: {
    banner: 'your-android-banner-id',
    interstitial: 'your-android-interstitial-id',
    rewarded: 'your-android-rewarded-id',
  },
};
```

4. Update the app IDs in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "your-android-app-id",
          "iosAppId": "your-ios-app-id"
        }
      ]
    ]
  }
}
```

### Permissions

The app requires microphone permission to measure sound levels. This is automatically requested when the user starts recording.

## Building for Production

### iOS

```bash
# Build for App Store
eas build --platform ios --profile production

# Local build
npx expo run:ios --configuration Release
```

### Android

```bash
# Build for Play Store
eas build --platform android --profile production

# Local build
npx expo run:android --variant release
```

## Features in Detail

### Sound Measurement
- Real-time decibel measurement using device microphone
- Calibration offset support for accuracy
- Multiple visualization modes
- Min/Max/Average tracking
- Real-time graph

### Data Management
- Automatic saving of measurements
- Measurement history with timestamps
- Export to CSV (with rewarded ad)
- Delete individual or all measurements

### Camera Feature
- Capture sound levels with visual context (planned)
- Gallery of saved captures (planned)

### Settings
- Enable/disable sound alerts
- Haptic feedback toggle
- Calibration adjustment
- Theme selection
- App sharing
- Data management

## Known Issues

- Audio metering values may vary between iOS and Android due to platform differences
- Camera functionality is currently a placeholder for future implementation

## Future Enhancements

- [ ] Actual camera integration for sound snapshots
- [ ] More detailed statistics and charts
- [ ] Sound level categories and references
- [ ] Multiple measurement profiles
- [ ] Widgets for iOS 14+ and Android 12+
- [ ] Apple Watch companion app
- [ ] Siri Shortcuts integration

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Credits

Designed and developed for iOS and Android platforms using React Native and Expo.
