// src/screens/TodayScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import TaskItem from '../components/TaskItem';
import FloatingButton from '../components/FloatingButton';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabParamList } from '../navigation/AppNavigator';

type TodayScreenRouteProp = RouteProp<TabParamList, 'Today'>;

type TodayScreenNavigationProp = StackNavigationProp<TabParamList, 'Today'>;

type Task = {
  title: string;
  category: string;
  categoryColor: string;
};

const TodayScreen = () => {
  const navigation = useNavigation<TodayScreenNavigationProp>();
  const route = useRoute<TodayScreenRouteProp>();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks every time screen focuses
  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        try {
          const stored = await AsyncStorage.getItem('tasks');
          if (stored) setTasks(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading tasks:', e);
        }
      };
      loadTasks();
    }, []),
  );

  // If navigation passed a new task, update immediately
  useEffect(() => {
    const newTask = route.params?.newTask;
    if (newTask) {
      setTasks(prev => [
        ...prev,
        {
          title: newTask.title,
          category: newTask.category,
          categoryColor: newTask.categoryColor ?? '#000', // ✅ fallback
        },
      ]);
    }
  }, [route.params?.newTask]);

  // Category counts
  const healthCount = tasks.filter(t => t.category === 'Health').length;
  const workCount = tasks.filter(t => t.category === 'Work').length;
  const mentalHealthCount = tasks.filter(
    t => t.category === 'Mental Health',
  ).length;
  const othersCount = tasks.filter(t => t.category === 'Others').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header title="Today" date="26 Dec" />

        {/* Category Cards */}
        <View style={styles.row}>
          <CategoryCard
            icon="💙"
            count={healthCount}
            title="Health"
            color="#e0f7fa"
          />
          <CategoryCard
            icon="📄"
            count={workCount}
            title="Work"
            color="#e8f5e9"
          />
        </View>
        <View style={styles.row}>
          <CategoryCard
            icon="💆"
            count={mentalHealthCount}
            title="Mental Health"
            color="#f3e5f5"
          />
          <CategoryCard
            icon="💾"
            count={othersCount}
            title="Others"
            color="#fce4ec"
          />
        </View>

        {/* Render dynamic tasks */}
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            title={task.title}
            category={task.category}
            categoryColor={task.categoryColor}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem('tasks');
          console.log('✅ All tasks cleared');
        }}
        style={{
          padding: 12,
          backgroundColor: 'red',
          margin: 20,
          width: 80,
          borderRadius: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>Delete</Text>
      </TouchableOpacity>

      <FloatingButton onPress={() => navigation.navigate('NewTask' as never)} />
    </SafeAreaView>
  );
};

export default TodayScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: { flexDirection: 'row', marginBottom: 15 },
});
