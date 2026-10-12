import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { AppIcon } from '../../utils/icons';

interface HeroBannerProps {
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: theme.radii.xxl,
      overflow: 'hidden',
      minHeight: 188,
    },
    pressed: {
      opacity: 0.94,
    },
    content: {
      padding: theme.spacing.xl,
      paddingRight: 108,
      gap: theme.spacing.sm,
      minHeight: 188,
      justifyContent: 'center',
    },
    eyebrow: {
      ...theme.typography.overline,
      color: theme.colors.heroText,
      opacity: 0.8,
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.heroText,
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.heroText,
      opacity: 0.9,
    },
    cta: {
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.onPrimary,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    ctaLabel: {
      ...theme.typography.label,
      color: theme.colors.primary,
    },
    motif: {
      position: 'absolute',
      right: 12,
      top: 28,
      width: 96,
      height: 132,
    },
    node: {
      position: 'absolute',
      borderRadius: 99,
    },
    link: {
      position: 'absolute',
      height: 1.5,
      backgroundColor: theme.colors.heroText,
      opacity: 0.45,
    },
    linkA: {
      width: 54,
      top: 28,
      left: 18,
      transform: [{ rotate: '28deg' }],
    },
    linkB: {
      width: 48,
      top: 70,
      left: 16,
      transform: [{ rotate: '-18deg' }],
    },
    linkC: {
      width: 40,
      top: 48,
      left: 40,
      transform: [{ rotate: '70deg' }],
    },
    nodeA: {
      width: 14,
      height: 14,
      top: 8,
      left: 10,
      backgroundColor: theme.colors.heroText,
    },
    nodeB: {
      width: 18,
      height: 18,
      top: 36,
      left: 58,
      backgroundColor: theme.colors.secondary,
    },
    nodeC: {
      width: 12,
      height: 12,
      top: 78,
      left: 18,
      backgroundColor: theme.colors.heroText,
    },
    nodeD: {
      width: 10,
      height: 10,
      top: 104,
      left: 62,
      backgroundColor: theme.colors.secondary,
    },
  });

export function HeroBanner({ onPress }: HeroBannerProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue learning"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[...theme.colors.hero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.eyebrow}>AI Learning Hub</Text>
          <Text style={styles.title}>Your AI journey starts here</Text>
          <Text style={styles.body}>
            Learn AI concepts. Build real projects.
          </Text>
          <View style={styles.cta}>
            <Text style={styles.ctaLabel}>Continue Learning</Text>
            <AppIcon
              name="chevron-right"
              color={theme.colors.primary}
              size={16}
            />
          </View>
        </View>
        <View style={styles.motif} accessibilityElementsHidden>
          <View style={[styles.link, styles.linkA]} />
          <View style={[styles.link, styles.linkB]} />
          <View style={[styles.link, styles.linkC]} />
          <View style={[styles.node, styles.nodeA]} />
          <View style={[styles.node, styles.nodeB]} />
          <View style={[styles.node, styles.nodeC]} />
          <View style={[styles.node, styles.nodeD]} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}
