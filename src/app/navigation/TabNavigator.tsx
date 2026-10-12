import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../../screens/home/HomeScreen';
import { ExploreScreen } from '../../screens/explore/ExploreScreen';
import { MyLearningScreen } from '../../screens/learning/MyLearningScreen';
import { AITutorScreen } from '../../screens/ai-tutor/AITutorScreen';
import { ProfileScreen } from '../../screens/profile/ProfileScreen';
import { useTheme } from '../../hooks/useTheme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const tabIconStyle = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
    minHeight: 28,
  },
});

function makeTabIcon(name: IconName) {
  return function TabIcon({
    color,
    size,
  }: {
    color: string;
    size: number;
    focused: boolean;
  }) {
    return (
      <View style={tabIconStyle.wrap}>
        <AppIcon name={name} color={color} size={size} />
      </View>
    );
  };
}

const HomeIcon = makeTabIcon('home');
const ExploreIcon = makeTabIcon('compass');
const LearningIcon = makeTabIcon('book-open');
const TutorIcon = makeTabIcon('sparkles');
const ProfileIcon = makeTabIcon('user');

export function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ExploreIcon,
          tabBarAccessibilityLabel: 'Explore',
        }}
      />
      <Tab.Screen
        name="MyLearning"
        component={MyLearningScreen}
        options={{
          title: 'My Learning',
          tabBarIcon: LearningIcon,
          tabBarAccessibilityLabel: 'My Learning',
        }}
      />
      <Tab.Screen
        name="AITutor"
        component={AITutorScreen}
        options={{
          title: 'AI Tutor',
          tabBarIcon: TutorIcon,
          tabBarAccessibilityLabel: 'AI Tutor',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ProfileIcon,
          tabBarAccessibilityLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
