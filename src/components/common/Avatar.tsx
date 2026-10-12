import { StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { initialsFromName } from '../../utils/format';

interface AvatarProps {
  name: string;
  size?: number;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    clip: {
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
    },
  });

export function Avatar({ name, size = 40 }: AvatarProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.clip,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.label, { fontSize: Math.round(size * 0.34) }]}>
        {initialsFromName(name)}
      </Text>
    </LinearGradient>
  );
}
