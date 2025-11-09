# Deployment Guide - Sound Meter App

## Quick Start

### Testing in Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start Expo development server:**
```bash
npm start
```

3. **Test with Expo Go (Limited - No AdMob):**
   - Install Expo Go on your device
   - Scan the QR code
   - Note: AdMob will not work in Expo Go

4. **Build Development Client (Recommended for full features):**
```bash
# iOS (Mac only)
npx expo run:ios

# Android
npx expo run:android
```

## Important Notes

### Google AdMob Integration

The app includes Google AdMob with:
- **Banner Ads**: Displayed at bottom of screens
- **Interstitial Ads**: Shown between actions (e.g., after camera captures)
- **Rewarded Ads**: Optional ads for premium features (e.g., data export)

Currently using **test IDs**. Before production:
1. Create AdMob account
2. Register your app
3. Create ad units
4. Replace test IDs in `src/types/index.ts` and `app.json`

### Audio Permissions

The app requires microphone access:
- **iOS**: Automatically requests via `NSMicrophoneUsageDescription`
- **Android**: Requires `RECORD_AUDIO` permission (already configured)

## Building for Production

### Option 1: Using EAS Build (Recommended)

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure EAS:**
```bash
eas build:configure
```

4. **Build for iOS:**
```bash
eas build --platform ios --profile production
```

5. **Build for Android:**
```bash
eas build --platform android --profile production
```

### Option 2: Local Builds

#### iOS Local Build

Requirements:
- macOS with Xcode installed
- Apple Developer account

```bash
# Build release version
npx expo run:ios --configuration Release

# Or use Xcode
npx expo prebuild
# Then open ios/soundmeterapp.xcworkspace in Xcode
```

#### Android Local Build

Requirements:
- Android Studio
- Android SDK
- JDK

```bash
# Build APK
npx expo run:android --variant release

# Build AAB (for Play Store)
cd android
./gradlew bundleRelease
```

## Production Checklist

Before releasing to App Store / Play Store:

- [ ] Update app version in `app.json`
- [ ] Replace AdMob test IDs with production IDs
- [ ] Update app icons and splash screen
- [ ] Configure app signing (iOS: certificates, Android: keystore)
- [ ] Test on real devices (both iOS and Android)
- [ ] Review privacy policy for microphone usage
- [ ] Test all ad placements
- [ ] Verify offline functionality
- [ ] Test data export feature
- [ ] Test all theme modes (light/dark/auto)
- [ ] Verify haptic feedback on supported devices
- [ ] Test calibration feature
- [ ] Review app store screenshots and descriptions

## App Store Submission

### iOS (App Store)

1. Create app in App Store Connect
2. Prepare metadata:
   - App name: Sound Meter
   - Category: Utilities
   - Description (see marketing copy below)
   - Screenshots (minimum 6.5" and 5.5" displays)
   - Privacy policy URL

3. Submit for review

### Android (Play Store)

1. Create app in Google Play Console
2. Prepare metadata:
   - App name: Sound Meter
   - Category: Tools
   - Description
   - Screenshots (phone and tablet)
   - Feature graphic
   - Privacy policy

3. Upload AAB file
4. Submit for review

## Marketing Copy

### App Description (English)

**Sound Meter - Professional Noise Level Measurement**

Turn your device into a professional sound level meter! Measure environmental noise levels accurately with multiple visualization modes and comprehensive data tracking.

**Features:**
• Real-time decibel measurement
• Multiple visualization modes (circular, radial, waveform, bar)
• Min/Max/Average statistics tracking
• Measurement history with timestamps
• Data export to CSV
• Sound alerts for dangerous noise levels
• Calibration support for accuracy
• Dark mode support
• 100% offline - no internet required
• Haptic feedback

**Perfect for:**
• Home noise monitoring
• Construction site compliance
• Office environment assessment
• Event sound level management
• Industrial safety checks
• Sleep quality monitoring
• Noise complaint documentation

**Privacy First:**
• All data stored locally on your device
• No cloud storage or data transmission
• Complete control over your measurements

Download now and start measuring sound levels professionally!

### Keywords

sound meter, decibel meter, noise meter, db meter, sound level, noise level, audio meter, spl meter, sound measurement, noise measurement, environmental monitoring, construction noise, office noise, industrial noise

## Monetization Strategy

### Current Implementation

1. **Banner Ads**:
   - Shown at bottom of all main screens
   - Non-intrusive placement
   - Always visible but doesn't block content

2. **Interstitial Ads**:
   - Shown after certain actions (e.g., camera captures)
   - Frequency: Every 3 actions
   - Skippable after 5 seconds

3. **Rewarded Ads**:
   - Optional for premium features
   - Currently: Data export feature
   - Users can skip and pay for premium

### Future Monetization Options

- Premium version without ads (In-App Purchase)
- Advanced features behind paywall:
  - Unlimited measurement history
  - Advanced statistics
  - PDF report generation
  - Multiple calibration profiles
  - Widget support

## Analytics (Future)

Consider adding analytics to track:
- Daily active users
- Measurement frequency
- Popular visualization modes
- Ad impressions and clicks
- Feature usage
- Crash reports

Recommended services:
- Google Analytics for Firebase
- Sentry for error tracking
- Mixpanel for user behavior

## Support & Maintenance

### Common Issues

**Issue**: Microphone permission denied
**Solution**: Guide users to app settings to enable microphone

**Issue**: Ads not showing
**Solution**: Verify AdMob IDs, check internet connection, ensure development client (not Expo Go)

**Issue**: Inaccurate readings
**Solution**: Use calibration feature, ensure no phone case blocking microphone

### Updates

Plan for regular updates:
- Bug fixes (as needed)
- OS compatibility updates (when new iOS/Android versions release)
- Feature updates (quarterly)
- UI improvements (based on user feedback)

## License & Legal

### Required Disclosures

1. **AdMob**: Google's advertising policies apply
2. **Microphone Usage**: Clearly state in privacy policy
3. **Data Collection**: Disclose what data is collected (even if none)
4. **Third-party Libraries**: Review licenses of all dependencies

### Privacy Policy

Create a privacy policy that covers:
- Microphone usage and audio data handling
- Local data storage
- No third-party data sharing (except AdMob)
- User rights (data deletion, access)
- Contact information for privacy concerns

## Success Metrics

Track these KPIs:
- Downloads per month
- Daily active users (DAU)
- Retention rate (Day 1, Day 7, Day 30)
- Ad revenue per user
- Average session duration
- Feature adoption rates
- App Store ratings and reviews

## Contact & Support

For technical issues or questions:
- GitHub Issues: [repository-url]
- Email: [your-support-email]
- Documentation: [docs-url]

---

Built with ❤️ using React Native and Expo
