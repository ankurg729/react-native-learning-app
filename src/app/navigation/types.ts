import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoryId } from '../../types';

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  MyLearning: undefined;
  AITutor: { prefill?: string } | undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  TutorialDetails: { tutorialId: string };
  LessonReader: { tutorialId: string; lessonId: string };
  Quiz: { quizId: string };
  CategoryDetails: { categoryId: CategoryId };
  Settings: undefined;
  EditProfile: undefined;
  About: undefined;
  Privacy: undefined;
  Notifications: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type StackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
