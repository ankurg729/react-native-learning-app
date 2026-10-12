import type {
  Category,
  CategoryFilter,
  DifficultyFilter,
  Tutorial,
  TutorialSort,
} from '../types';

export interface TutorialQuery {
  query: string;
  categoryId: CategoryFilter;
  difficulty: DifficultyFilter;
  sort: TutorialSort;
  categories: readonly Category[];
}

export function filterTutorials(
  items: readonly Tutorial[],
  options: TutorialQuery,
): Tutorial[] {
  const query = options.query.trim().toLowerCase();
  const categoryNames = new Map(
    options.categories.map(category => [
      category.id,
      category.title.toLowerCase(),
    ]),
  );

  const filtered = items.filter(item => {
    if (
      options.categoryId !== 'All' &&
      item.categoryId !== options.categoryId
    ) {
      return false;
    }
    if (
      options.difficulty !== 'All' &&
      item.difficulty !== options.difficulty
    ) {
      return false;
    }
    if (!query) {
      return true;
    }
    const haystack = [
      item.title,
      item.shortDescription,
      item.description,
      categoryNames.get(item.categoryId) ?? '',
      item.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  return [...filtered].sort((a, b) => {
    if (options.sort === 'popular') {
      return b.popularity - a.popularity;
    }
    if (options.sort === 'recent') {
      return b.addedAt.localeCompare(a.addedAt);
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return b.popularity - a.popularity;
  });
}

export function hasActiveFilters(options: {
  query: string;
  categoryId: CategoryFilter;
  difficulty: DifficultyFilter;
  sort: TutorialSort;
}): boolean {
  return (
    options.query.trim().length > 0 ||
    options.categoryId !== 'All' ||
    options.difficulty !== 'All' ||
    options.sort !== 'recommended'
  );
}
