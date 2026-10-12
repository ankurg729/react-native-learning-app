import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: IconName;
  accent: string;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      ...surfaceStyle(theme),
      width: 168,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    pressed: {
      opacity: 0.86,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
  });

function CategoryCardComponent({
  title,
  description,
  icon,
  accent,
  onPress,
}: CategoryCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
        <AppIcon name={icon} color={accent} size={20} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

export const CategoryCard = memo(CategoryCardComponent);
