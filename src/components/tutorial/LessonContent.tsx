import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { CalloutTone, LessonSection } from '../../types';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';
import { CodeBlock } from './CodeBlock';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    stack: {
      gap: theme.spacing.lg,
    },
    heading: {
      ...theme.typography.heading,
      color: theme.colors.text,
    },
    paragraph: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    bulletRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    bulletMark: {
      ...theme.typography.bodyStrong,
      color: theme.colors.primary,
    },
    bulletText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
    },
    callout: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
      borderWidth: 1,
    },
    calloutTitle: {
      ...theme.typography.label,
    },
    calloutBody: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    output: {
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    outputLabel: {
      ...theme.typography.overline,
      color: theme.colors.textMuted,
    },
    outputText: {
      ...theme.typography.code,
      color: theme.colors.text,
    },
    calloutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });

function calloutVisual(
  theme: Theme,
  tone: CalloutTone,
): {
  background: string;
  border: string;
  color: string;
  icon: IconName;
} {
  if (tone === 'warning') {
    return {
      background: theme.colors.warningMuted,
      border: theme.colors.warning,
      color: theme.colors.warning,
      icon: 'alert',
    };
  }
  if (tone === 'tip') {
    return {
      background: theme.colors.successMuted,
      border: theme.colors.success,
      color: theme.colors.success,
      icon: 'lightbulb',
    };
  }
  return {
    background: theme.colors.secondaryMuted,
    border: theme.colors.secondary,
    color: theme.colors.secondary,
    icon: 'info',
  };
}

export function LessonContent({ sections }: { sections: LessonSection[] }) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.stack}>
      {sections.map((section, index) => {
        const key = `${section.type}-${index}`;
        if (section.type === 'heading') {
          return (
            <Text key={key} style={styles.heading} accessibilityRole="header">
              {section.text}
            </Text>
          );
        }
        if (section.type === 'paragraph') {
          return (
            <Text key={key} style={styles.paragraph}>
              {section.text}
            </Text>
          );
        }
        if (section.type === 'bullets') {
          return (
            <View key={key}>
              {section.items.map(item => (
                <View key={item} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          );
        }
        if (section.type === 'callout') {
          const visual = calloutVisual(theme, section.tone);
          return (
            <View
              key={key}
              style={[
                styles.callout,
                {
                  backgroundColor: visual.background,
                  borderColor: visual.border,
                },
              ]}
            >
              <View style={styles.calloutHeader}>
                <AppIcon name={visual.icon} color={visual.color} size={16} />
                <Text style={[styles.calloutTitle, { color: visual.color }]}>
                  {section.title}
                </Text>
              </View>
              <Text style={styles.calloutBody}>{section.text}</Text>
            </View>
          );
        }
        if (section.type === 'code') {
          return (
            <CodeBlock
              key={key}
              language={section.language}
              code={section.code}
            />
          );
        }
        return (
          <View key={key} style={styles.output}>
            <Text style={styles.outputLabel}>Sample output</Text>
            <Text style={styles.outputText}>{section.text}</Text>
          </View>
        );
      })}
    </View>
  );
}
