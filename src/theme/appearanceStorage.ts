import type { AppearancePreference } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

const PREFERENCES: AppearancePreference[] = ['dark', 'light', 'system'];

export function isAppearancePreference(
  value: string | null,
): value is AppearancePreference {
  return PREFERENCES.some(preference => preference === value);
}

export async function loadAppearance(): Promise<AppearancePreference> {
  const stored = await readStorage(STORAGE_KEYS.appearance);
  if (isAppearancePreference(stored)) {
    return stored;
  }
  return 'dark';
}

export async function saveAppearance(
  preference: AppearancePreference,
): Promise<void> {
  await writeStorage(STORAGE_KEYS.appearance, preference);
}
