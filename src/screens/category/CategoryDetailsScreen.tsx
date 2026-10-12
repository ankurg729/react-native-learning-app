import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TutorialCard } from '../../components/cards/TutorialCard';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'CategoryDetails'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    list: {
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
    },
  });

export function CategoryDetailsScreen({ navigation, route }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const insets = useSafeAreaInsets();
  const category = learning.getCategory(route.params.categoryId);
  const tutorials = learning.tutorials.filter(
    tutorial => tutorial.categoryId === route.params.categoryId,
  );

  if (!category) {
    return (
      <View
        style={[
          styles.screen,
          { padding: theme.spacing.xl, paddingTop: insets.top },
        ]}
      >
        <AppHeader title="Category" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="search"
          title="Category unavailable"
          message="That path is not in the local catalog."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={tutorials}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + theme.spacing.md },
        ]}
        ListHeaderComponent={
          <View>
            <AppHeader
              title={category.title}
              onBack={() => navigation.goBack()}
            />
            <Text style={styles.description}>{category.description}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TutorialCard
            title={item.title}
            description={item.shortDescription}
            category={category.title}
            difficulty={item.difficulty}
            minutes={item.estimatedMinutes}
            lessonCount={item.lessonCount}
            icon={item.thumbnail.icon}
            accent={theme.colors.category[item.categoryId]}
            bookmarked={learning.isTutorialBookmarked(item.id)}
            onPress={() =>
              navigation.navigate('TutorialDetails', { tutorialId: item.id })
            }
            onToggleBookmark={() => learning.toggleTutorialBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="book-open"
            title="No tutorials yet"
            message="This category does not have local tutorials."
          />
        }
      />
    </View>
  );
}
