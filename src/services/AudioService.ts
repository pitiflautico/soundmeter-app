import { Audio } from 'expo-av';

export class AudioService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private metering: number[] = [];
  private meteringCallback: ((db: number) => void) | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  async startMonitoring(callback: (db: number) => void): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      this.meteringCallback = callback;
      this.recording = new Audio.Recording();

      await this.recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      this.recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          // Convert metering to decibels (expo-av provides metering in dB already on iOS)
          // On Android it might be different, so we normalize it
          let db = status.metering;

          // Normalize: typical range is -160 to 0 dB
          // We map it to a more user-friendly 0-120 dB range
          db = Math.max(0, Math.min(120, db + 120));

          this.metering.push(db);
          if (this.metering.length > 100) {
            this.metering.shift();
          }

          if (this.meteringCallback) {
            this.meteringCallback(db);
          }
        }
      });

      await this.recording.startAsync();
      this.isRecording = true;

      // Set update interval
      this.recording.setProgressUpdateInterval(100);

      return true;
    } catch (error) {
      console.error('Error starting audio monitoring:', error);
      return false;
    }
  }

  async stopMonitoring(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
      this.isRecording = false;
      this.meteringCallback = null;
      this.metering = [];
    } catch (error) {
      console.error('Error stopping audio monitoring:', error);
    }
  }

  getMetering(): number[] {
    return [...this.metering];
  }

  isMonitoring(): boolean {
    return this.isRecording;
  }

  // Simulate decibel reading for testing (when permissions are not available)
  simulateReading(): number {
    return Math.random() * 40 + 40; // Random value between 40-80 dB
  }
}

export const audioService = new AudioService();
