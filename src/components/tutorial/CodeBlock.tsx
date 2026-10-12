import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { highlightCode, type CodeTone } from '../../utils/highlightCode';
import { AppIcon } from '../../utils/icons';

interface CodeBlockProps {
  language: string;
  code: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.codeBackground,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    language: {
      ...theme.typography.overline,
      color: theme.colors.codeComment,
    },
    copy: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
    },
    copyLabel: {
      ...theme.typography.caption,
      color: theme.colors.codePlain,
    },
    codePad: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    line: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

function toneColor(theme: Theme, tone: CodeTone): string {
  switch (tone) {
    case 'keyword':
      return theme.colors.codeKeyword;
    case 'string':
      return theme.colors.codeString;
    case 'comment':
      return theme.colors.codeComment;
    case 'number':
      return theme.colors.codeNumber;
    case 'function':
      return theme.colors.codeFunction;
    default:
      return theme.colors.codePlain;
  }
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const lines = highlightCode(code);

  const copy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.language}>{language}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Code copied' : 'Copy code'}
          onPress={copy}
          style={styles.copy}
        >
          <AppIcon
            name={copied ? 'check' : 'copy'}
            color={theme.colors.codePlain}
            size={14}
          />
          <Text style={styles.copyLabel}>
            {copied ? 'Copied' : 'Copy code'}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.codePad}>
          {lines.map((tokens, lineIndex) => (
            <View key={`${language}-${lineIndex}`} style={styles.line}>
              {tokens.map((token, tokenIndex) => (
                <Text
                  key={`${lineIndex}-${tokenIndex}`}
                  style={[
                    theme.typography.code,
                    { color: toneColor(theme, token.tone) },
                  ]}
                >
                  {token.text}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
