import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
  StatusBar,
} from 'react-native';

interface Task {
  id: string;
  text: string;
  checked: boolean;
  description?: string;
}

const tasksData: Task[] = [
  {
    id: '1',
    text: 'Set a reminder beforehand',
    checked: false,
    description: 'Use your phone or something else. But don’t forget.',
  },
  { id: '2', text: 'Find a location', checked: false },
  { id: '3', text: 'Screenshot the address', checked: false },
  { id: '4', text: 'Book the tickets', checked: false },
  { id: '5', text: 'Find out the parking', checked: false },
  { id: '6', text: 'Call them', checked: false },
];

export default function BookingMovieScreen() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);

  const toggleCheck = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, checked: !task.checked } : task,
      ),
    );
  };

  const renderTask: ListRenderItem<Task> = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.taskRow}
            onPress={() => toggleCheck(item.id)}
          >
            <View
              style={[
                styles.customCheckbox,
                item.checked && styles.checkboxChecked,
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.text}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <TouchableOpacity style={styles.reminderButton}>
                <Text style={styles.reminderText}>Add reminder</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.taskRow}
        onPress={() => toggleCheck(item.id)}
      >
        <View
          style={[
            styles.customCheckbox,
            item.checked && styles.checkboxChecked,
          ]}
        />
        <Text style={styles.taskText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.header}>Booking Movie Tickets</Text>
      <Text style={styles.subHeader}>Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1B1E28',
  },
  subHeader: {
    fontSize: 14,
    color: '#7B7E8A',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1E28',
  },
  taskDescription: {
    fontSize: 14,
    color: '#7B7E8A',
    marginTop: 2,
    marginBottom: 8,
  },
  reminderButton: {
    backgroundColor: '#1B1E28',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  reminderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  comment: {
    fontSize: 13,
    color: '#7B7E8A',
  },
  taskText: {
    fontSize: 16,
    color: '#1B1E28',
  },
});
