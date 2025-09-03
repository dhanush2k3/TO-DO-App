// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TodayScreen from '../screens/TodayScreen';
import CalendarScreen from '../screens/CalendarScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import BookingMovieScreen from '../screens/BookingMovieScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import CustomTabBar from '../components/tabBar/CustomTabBar';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  TaskDetail: { taskId: string };
  MovieTicket: undefined;
  NewTask: undefined;
};

export type TabParamList = {
  Today:
    | {
        newTask?: {
          id: string;
          title: string;
          category: string;
          categoryColor: string;
          date: string;
          time: string;
          duration: string;
        };
      }
    | undefined;
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
    <Tab.Screen
      name="Today"
      component={TodayScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Calendar"
      component={CalendarScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MovieTicket" component={BookingMovieScreen} />
        <Stack.Screen
          name="NewTask"
          component={NewTaskScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
