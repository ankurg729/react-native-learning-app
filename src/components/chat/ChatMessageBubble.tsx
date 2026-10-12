import { StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant';
  text: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      marginBottom: theme.spacing.md,
    },
    userRow: {
      alignItems: 'flex-end',
    },
    bubble: {
      maxWidth: '86%',
      borderRadius: theme.radii.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    assistant: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderTopLeftRadius: theme.radii.sm,
    },
    user: {
      backgroundColor: theme.colors.primary,
      borderTopRightRadius: theme.radii.sm,
    },
    assistantText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    userText: {
      ...theme.typography.body,
      color: theme.colors.onPrimary,
    },
    caption: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
  });

export function ChatMessageBubble({ role, text }: ChatMessageBubbleProps) {
  const styles = useThemedStyles(createStyles);
  const isUser = role === 'user';

  return (
    <View style={[styles.row, isUser && styles.userRow]}>
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text style={isUser ? styles.userText : styles.assistantText}>
          {text}
        </Text>
        {isUser ? null : <Text style={styles.caption}>Prepared example</Text>}
      </View>
    </View>
  );
}
