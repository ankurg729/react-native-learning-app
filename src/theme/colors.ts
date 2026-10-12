import type { CategoryId, ColorMode, Difficulty } from '../types';

export interface Palette {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryPressed: string;
  primaryMuted: string;
  onPrimary: string;
  secondary: string;
  secondaryMuted: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  danger: string;
  dangerMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  input: string;
  overlay: string;
  tabBar: string;
  hero: readonly [string, string, string];
  heroText: string;
  codeBackground: string;
  codePlain: string;
  codeKeyword: string;
  codeString: string;
  codeComment: string;
  codeNumber: string;
  codeFunction: string;
  difficulty: Record<Difficulty, { background: string; text: string }>;
  category: Record<CategoryId, string>;
}

const categoryAccents: Record<CategoryId, string> = {
  'generative-ai': '#A78BFA',
  'prompt-engineering': '#FBBF24',
  rag: '#22D3EE',
  'mcp-agents': '#34D399',
  'llm-fundamentals': '#60A5FA',
  'ai-projects': '#F472B6',
};

export const darkPalette: Palette = {
  background: '#0B1020',
  surface: '#151C2E',
  surfaceElevated: '#1C2540',
  primary: '#8B5CF6',
  primaryPressed: '#7C3AED',
  primaryMuted: '#8B5CF629',
  onPrimary: '#FFFFFF',
  secondary: '#22D3EE',
  secondaryMuted: '#22D3EE24',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#243049',
  danger: '#F87171',
  dangerMuted: '#F8717124',
  success: '#34D399',
  successMuted: '#34D39924',
  warning: '#FBBF24',
  warningMuted: '#FBBF2424',
  input: '#0F1628',
  overlay: '#020617B8',
  tabBar: '#10182A',
  hero: ['#1E1B4B', '#5B21B6', '#0E7490'],
  heroText: '#F8FAFC',
  codeBackground: '#0A1020',
  codePlain: '#E2E8F0',
  codeKeyword: '#C4B5FD',
  codeString: '#86EFAC',
  codeComment: '#64748B',
  codeNumber: '#67E8F9',
  codeFunction: '#FDBA74',
  difficulty: {
    Beginner: { background: '#34D39924', text: '#6EE7B7' },
    Intermediate: { background: '#38BDF824', text: '#7DD3FC' },
    Advanced: { background: '#F472B624', text: '#F9A8D4' },
  },
  category: categoryAccents,
};

export const lightPalette: Palette = {
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#6D4AFF',
  primaryPressed: '#5B3AE6',
  primaryMuted: '#6D4AFF1A',
  onPrimary: '#FFFFFF',
  secondary: '#0891B2',
  secondaryMuted: '#0891B21A',
  text: '#172033',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  danger: '#DC2626',
  dangerMuted: '#DC262614',
  success: '#059669',
  successMuted: '#05966914',
  warning: '#D97706',
  warningMuted: '#D9770614',
  input: '#F8FAFC',
  overlay: '#17203366',
  tabBar: '#FFFFFF',
  hero: ['#6D4AFF', '#7C3AED', '#0891B2'],
  heroText: '#FFFFFF',
  codeBackground: '#0F172A',
  codePlain: '#E2E8F0',
  codeKeyword: '#C4B5FD',
  codeString: '#86EFAC',
  codeComment: '#94A3B8',
  codeNumber: '#67E8F9',
  codeFunction: '#FDBA74',
  difficulty: {
    Beginner: { background: '#05966914', text: '#047857' },
    Intermediate: { background: '#0284C714', text: '#0369A1' },
    Advanced: { background: '#DB277714', text: '#BE185D' },
  },
  category: {
    'generative-ai': '#6D4AFF',
    'prompt-engineering': '#D97706',
    rag: '#0891B2',
    'mcp-agents': '#059669',
    'llm-fundamentals': '#2563EB',
    'ai-projects': '#DB2777',
  },
};

export const palettes: Record<ColorMode, Palette> = {
  dark: darkPalette,
  light: lightPalette,
};
