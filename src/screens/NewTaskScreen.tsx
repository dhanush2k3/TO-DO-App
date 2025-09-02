// src/screens/NewTaskScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NewTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewTask'
>;

const categories = ['Health', 'Work', 'Mental Health', 'Others'];

const categoryColorMap: Record<string, string> = {
  Health: 'blue',
  Work: 'green',
  'Mental Health': 'purple',
  Others: 'pink',
};

const durations = ['30m', '1h', '2h', '3h', '4h'];

const NewTaskScreen = () => {
  const navigation = useNavigation<NewTaskScreenNavigationProp>();
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('1h');

  const handleSave = async () => {
    if (!taskTitle || !selectedCategory) return;

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      category: selectedCategory,
      categoryColor: categoryColorMap[selectedCategory] ?? '#000',
      date: date.toISOString().split('T')[0], // "2025-08-26"
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration,
    };

    try {
      const stored: string | null = await AsyncStorage.getItem('tasks');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [...existing, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));

      navigation.navigate('Today', { newTask });

      setTaskTitle('');
      setSelectedCategory('');
    } catch (e) {
      console.error('Error saving task:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Write a new task...</Text>
      <TextInput
        style={styles.input}
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholder="Add a Task"
        placeholderTextColor={'#000'}
      />

      <Text style={styles.label}>Choose Category</Text>
      <View style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.selectedCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Time Picker */}
      <Text style={styles.label}>Select Time</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setDate(selectedTime);
          }}
        />
      )}

      {/* Duration Picker */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.categoryRow}>
        {durations.map(d => (
          <TouchableOpacity
            key={d}
            style={[
              styles.categoryButton,
              duration === d && styles.selectedCategory,
            ]}
            onPress={() => setDuration(d)}
          >
            <Text
              style={[
                styles.categoryText,
                duration === d && styles.selectedCategoryText,
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewTaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
  },
  selectedCategory: { backgroundColor: '#007bff', borderColor: '#007bff' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedCategoryText: { color: '#fff', fontWeight: 'bold' },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
