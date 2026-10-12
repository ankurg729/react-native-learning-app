import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { Difficulty, IconName } from '../../types';
import { formatMinutes } from '../../utils/format';
import { AppIcon } from '../../utils/icons';

interface TutorialCardProps {
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  minutes: number;
  lessonCount: number;
  icon: IconName;
  accent: string;
  bookmarked: boolean;
  onPress: () => void;
  onToggleBookmark: () => void;
  variant?: 'compact' | 'full' | 'featured';
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    compact: {
      width: 250,
      marginRight: theme.spacing.md,
    },
    featured: {
      padding: theme.spacing.xl,
      borderColor: theme.colors.primary,
    },
    pressed: {
      opacity: 0.9,
    },
    top: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
    },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
      gap: 4,
    },
    eyebrow: {
      ...theme.typography.overline,
      color: theme.colors.secondary,
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    bookmark: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

function TutorialCardComponent({
  title,
  description,
  category,
  difficulty,
  minutes,
  lessonCount,
  icon,
  accent,
  bookmarked,
  onPress,
  onToggleBookmark,
  variant = 'full',
}: TutorialCardProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        variant === 'compact' && styles.compact,
        variant === 'featured' && styles.featured,
        pressed && styles.pressed,
      ]}
    >
      {variant === 'featured' ? (
        <Text style={styles.eyebrow}>Featured</Text>
      ) : null}
      <View style={styles.top}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
          <AppIcon name={icon} color={accent} size={20} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.metaText}>{category}</Text>
          <Text style={styles.title}>{title}</Text>
          {description && variant !== 'compact' ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            bookmarked ? `Remove bookmark for ${title}` : `Bookmark ${title}`
          }
          accessibilityState={{ selected: bookmarked }}
          onPress={onToggleBookmark}
          hitSlop={8}
          style={styles.bookmark}
        >
          <AppIcon
            name="bookmark"
            color={
              bookmarked ? theme.colors.primary : theme.colors.textSecondary
            }
            filled={bookmarked}
            size={18}
          />
        </Pressable>
      </View>
      <View style={styles.meta}>
        <DifficultyBadge difficulty={difficulty} />
        <Text style={styles.metaText}>{formatMinutes(minutes)}</Text>
        <Text style={styles.metaText}>
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </Text>
      </View>
    </Pressable>
  );
}

export const TutorialCard = memo(TutorialCardComponent);
