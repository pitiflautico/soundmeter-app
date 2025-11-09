import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioReading } from '../types';

const READINGS_KEY = 'audio_readings';
const MAX_READINGS = 1000;

export class StorageService {
  async saveReading(reading: AudioReading): Promise<void> {
    try {
      const readings = await this.getReadings();
      readings.unshift(reading);

      // Keep only the last MAX_READINGS
      if (readings.length > MAX_READINGS) {
        readings.splice(MAX_READINGS);
      }

      await AsyncStorage.setItem(READINGS_KEY, JSON.stringify(readings));
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  }

  async getReadings(): Promise<AudioReading[]> {
    try {
      const data = await AsyncStorage.getItem(READINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting readings:', error);
      return [];
    }
  }

  async deleteReading(id: string): Promise<void> {
    try {
      const readings = await this.getReadings();
      const filtered = readings.filter((r) => r.id !== id);
      await AsyncStorage.setItem(READINGS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  }

  async clearAllReadings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(READINGS_KEY);
    } catch (error) {
      console.error('Error clearing readings:', error);
    }
  }

  async getReadingsByDateRange(startDate: number, endDate: number): Promise<AudioReading[]> {
    try {
      const readings = await this.getReadings();
      return readings.filter(
        (r) => r.timestamp >= startDate && r.timestamp <= endDate
      );
    } catch (error) {
      console.error('Error getting readings by date:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();
