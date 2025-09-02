// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TodayScreen from '../screens/TodayScreen';
import CalendarScreen from '../screens/CalendarScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import BookingMovieScreen from '../screens/BookingMovieScreen';
import NewTaskScreen from '../screens/NewTaskScreen';

export type RootStackParamList = {
  Today:
    | { newTask?: { title: string; category: string; categoryColor?: string } }
    | undefined;
  Calendar: undefined;
  TaskDetail: { taskId: string };
  MovieTicket: undefined;
  NewTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendar">
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Today" component={TodayScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="MovieTicket" component={BookingMovieScreen} />
        <Stack.Screen name="NewTask" component={NewTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
