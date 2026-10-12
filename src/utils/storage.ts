import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  appearance: '@ai-learning-hub/appearance',
  learning: '@ai-learning-hub/learning',
} as const;

export async function readStorage(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function writeStorage(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Persistence is a convenience. The in-memory session still works.
  }
}
