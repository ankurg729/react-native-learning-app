import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TutorialCard } from '../../components/cards/TutorialCard';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { FilterChip } from '../../components/common/FilterChip';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type {
  CategoryFilter,
  DifficultyFilter,
  Tutorial,
  TutorialSort,
} from '../../types';
import type { TabScreenProps } from '../../app/navigation/types';
import { filterTutorials, hasActiveFilters } from '../../utils/filterTutorials';

type Props = TabScreenProps<'Explore'>;

const DIFFICULTIES: DifficultyFilter[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
];

const SORTS: Array<{ id: TutorialSort; label: string }> = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'recent', label: 'Recently Added' },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    chipRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.xl,
    },
    listGap: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
    },
    clear: {
      ...theme.typography.label,
      color: theme.colors.primary,
    },
  });

export function ExploreScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryFilter>('All');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [sort, setSort] = useState<TutorialSort>('recommended');

  const filtered = useMemo(
    () =>
      filterTutorials(learning.tutorials, {
        query,
        categoryId,
        difficulty,
        sort,
        categories: learning.categories,
      }),
    [
      learning.tutorials,
      learning.categories,
      query,
      categoryId,
      difficulty,
      sort,
    ],
  );

  const featured = filtered.find(item => item.featured);
  const rest = featured
    ? filtered.filter(item => item.id !== featured.id)
    : filtered;
  const filtersActive = hasActiveFilters({
    query,
    categoryId,
    difficulty,
    sort,
  });

  const clearFilters = () => {
    setQuery('');
    setCategoryId('All');
    setDifficulty('All');
    setSort('recommended');
  };

  const renderCard = (item: Tutorial, variant: 'full' | 'featured') => (
    <TutorialCard
      variant={variant}
      title={item.title}
      description={item.shortDescription}
      category={learning.getCategory(item.categoryId)?.title ?? ''}
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
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={rest}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listGap,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppHeader
              title="Explore"
              subtitle="Search tutorials, paths, and practice."
            />
            <SearchBar value={query} onChangeText={setQuery} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                <FilterChip
                  label="All topics"
                  selected={categoryId === 'All'}
                  onPress={() => setCategoryId('All')}
                />
                {learning.categories.map(category => (
                  <FilterChip
                    key={category.id}
                    label={category.title}
                    selected={categoryId === category.id}
                    onPress={() => setCategoryId(category.id)}
                  />
                ))}
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {DIFFICULTIES.map(item => (
                  <FilterChip
                    key={item}
                    label={item}
                    selected={difficulty === item}
                    onPress={() => setDifficulty(item)}
                  />
                ))}
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {SORTS.map(item => (
                  <FilterChip
                    key={item.id}
                    label={item.label}
                    selected={sort === item.id}
                    onPress={() => setSort(item.id)}
                  />
                ))}
                {filtersActive ? (
                  <FilterChip
                    label="Clear filters"
                    selected={false}
                    onPress={clearFilters}
                  />
                ) : null}
              </View>
            </ScrollView>
            {featured ? (
              <View>
                <SectionHeader title="Featured" />
                {renderCard(featured, 'featured')}
              </View>
            ) : null}
            {rest.length > 0 ? <SectionHeader title="Tutorials" /> : null}
          </View>
        }
        renderItem={({ item }) => renderCard(item, 'full')}
        ListEmptyComponent={
          filtered.length === 0 ? (
            <EmptyState
              icon="search"
              title="No tutorials match"
              message="Try another keyword, or clear the filters to see the full catalog."
              actionLabel={filtersActive ? 'Clear filters' : undefined}
              onAction={filtersActive ? clearFilters : undefined}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
