import type { ViewStyle } from 'react-native';
import type { ColorMode } from '../types';

export interface ShadowSet {
  card: ViewStyle;
  soft: ViewStyle;
}

export function createShadows(mode: ColorMode): ShadowSet {
  if (mode === 'dark') {
    return {
      card: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
        elevation: 4,
      },
      soft: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 2,
      },
    };
  }

  return {
    card: {
      shadowColor: '#172033',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 3,
    },
    soft: {
      shadowColor: '#172033',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 1,
    },
  };
}
