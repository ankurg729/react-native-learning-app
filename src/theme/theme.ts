import { palettes } from './colors';
import { radii, spacing } from './spacing';
import { createShadows, type ShadowSet } from './shadows';
import { typography } from './typography';
import type { Palette } from './colors';
import type { ColorMode } from '../types';

export interface Theme {
  mode: ColorMode;
  colors: Palette;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: ShadowSet;
}

export function buildTheme(mode: ColorMode): Theme {
  return {
    mode,
    colors: palettes[mode],
    typography,
    spacing,
    radii,
    shadows: createShadows(mode),
  };
}
