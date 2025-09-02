import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function TaskDetailScreen() {
  const [subtasks, setSubtasks] = useState([
    { text: 'Get a notebook', checked: false },
    { text: 'Follow the youtube tutorial', checked: false },
    { text: 'Take Notes', checked: false },
    { text: 'Practice', checked: false },
    { text: 'Add subtask', checked: false },
  ]);

  const toggleCheck = (index: number) => {
    const updated = [...subtasks];
    updated[index].checked = !updated[index].checked;
    setSubtasks(updated);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton}>
          <Text style={{ fontSize: 24, fontWeight: '600' }}>✕</Text>
        </TouchableOpacity>

        {/* Task Title */}
        <Text style={styles.title}>Stretch everyday for</Text>
        <Text style={styles.title}>15 mins</Text>

        {/* Subtasks */}
        {subtasks.map((item, index) => (
          <View key={index} style={styles.subtaskRow}>
            <CheckBox
              value={item.checked}
              onValueChange={() => toggleCheck(index)}
              tintColors={{ true: '#4CAF50', false: '#aaa' }}
            />
            <TextInput style={styles.subtaskText} defaultValue={item.text} />
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 10,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  subtaskText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 2,
  },
  saveButton: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
