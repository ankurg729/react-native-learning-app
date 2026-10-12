import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatMessageBubble } from '../../components/chat/ChatMessageBubble';
import { PromptSuggestionChip } from '../../components/chat/PromptSuggestionChip';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { IconButton } from '../../components/common/IconButton';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../hooks/useTheme';
import { introMessage, suggestedPrompts } from '../../data/chat';
import { getMockTutorReply } from '../../services/mockChatService';
import type { Theme } from '../../theme/theme';
import type { ChatMessage } from '../../types';
import type { TabScreenProps } from '../../app/navigation/types';
import { AppIcon } from '../../utils/icons';

type Props = TabScreenProps<'AITutor'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryMuted,
    },
    titles: {
      flex: 1,
      gap: 2,
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    messages: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.md,
      flexGrow: 1,
    },
    empty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    suggestions: {
      paddingVertical: theme.spacing.sm,
    },
    suggestionRow: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.xl,
    },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    input: {
      flex: 1,
      minHeight: 48,
      maxHeight: 120,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.input,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      ...theme.typography.body,
    },
    send: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    sendDisabled: {
      opacity: 0.4,
    },
  });

export function AITutorScreen({ route }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const appliedPrefill = useRef<string | undefined>(undefined);

  useEffect(() => {
    const prefill = route.params?.prefill;
    if (prefill && prefill !== appliedPrefill.current) {
      appliedPrefill.current = prefill;
      setDraft(prefill);
    }
  }, [route.params?.prefill]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) {
      return;
    }
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages(current => [...current, userMessage]);
    setDraft('');
    setTyping(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const reply = getMockTutorReply(trimmed);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply.text,
        createdAt: new Date().toISOString(),
      };
      setMessages(current => [...current, assistantMessage]);
      setTyping(false);
    }, 800);
  };

  const showSuggestions = messages.length <= 1 && !typing;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}
      >
        <View style={styles.avatar}>
          <AppIcon name="sparkles" color={theme.colors.primary} size={22} />
        </View>
        <View style={styles.titles}>
          <Text style={styles.title}>AI Tutor</Text>
          <Text style={styles.subtitle}>Practice tutor · local examples</Text>
        </View>
        <IconButton
          icon="trash"
          label="Clear conversation"
          onPress={() => setConfirmClear(true)}
        />
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.messages,
          messages.length === 0 && styles.empty,
        ]}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <ChatMessageBubble role={item.role} text={item.text} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="message"
            title="Ask a practice question"
            message="Suggestions below use prepared answers stored in the app. A live model is not connected."
          />
        }
        ListFooterComponent={
          typing ? (
            <LoadingIndicator label="Preparing a practice reply…" />
          ) : undefined
        }
      />
      {showSuggestions ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestions}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.suggestionRow}>
            {suggestedPrompts.map(prompt => (
              <PromptSuggestionChip
                key={prompt}
                label={prompt}
                onPress={() => send(prompt)}
              />
            ))}
          </View>
        </ScrollView>
      ) : null}
      <View
        style={[
          styles.composer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask about a lesson or concept"
          placeholderTextColor={theme.colors.textMuted}
          accessibilityLabel="Message the practice tutor"
          multiline
          submitBehavior="submit"
          returnKeyType="send"
          onSubmitEditing={() => send(draft)}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          disabled={draft.trim().length === 0 || typing}
          onPress={() => send(draft)}
          style={[
            styles.send,
            (draft.trim().length === 0 || typing) && styles.sendDisabled,
          ]}
        >
          <AppIcon name="send" color={theme.colors.onPrimary} size={18} />
        </Pressable>
      </View>
      <ConfirmDialog
        visible={confirmClear}
        title="Clear this conversation?"
        message="Messages on this device will be removed. The practice tutor will stay available."
        confirmLabel="Clear"
        destructive
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setMessages([]);
          setDraft('');
          setConfirmClear(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}
