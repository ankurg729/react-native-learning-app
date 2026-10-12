import { useMemo } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { AboutScreen } from '../../screens/settings/AboutScreen';
import { PrivacyScreen } from '../../screens/settings/PrivacyScreen';
import { SettingsScreen } from '../../screens/settings/SettingsScreen';
import { EditProfileScreen } from '../../screens/profile/EditProfileScreen';
import { NotificationsScreen } from '../../screens/notifications/NotificationsScreen';
import { CategoryDetailsScreen } from '../../screens/category/CategoryDetailsScreen';
import { TutorialDetailsScreen } from '../../screens/tutorial-details/TutorialDetailsScreen';
import { LessonReaderScreen } from '../../screens/lesson-reader/LessonReaderScreen';
import { QuizScreen } from '../../screens/quiz/QuizScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();
  const navigationTheme = useMemo(() => {
    const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
        notification: theme.colors.secondary,
      },
    };
  }, [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="TutorialDetails"
          component={TutorialDetailsScreen}
        />
        <Stack.Screen name="LessonReader" component={LessonReaderScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetailsScreen}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
