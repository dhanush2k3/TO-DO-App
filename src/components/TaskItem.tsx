// src/components/TaskItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from './CheckBox';

interface Subtask {
  title: string;
}

interface TaskItemProps {
  title: string;
  category: string;
  categoryColor: string;
  subtasks?: Subtask[];
  onPress?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  category,
  categoryColor,
  subtasks,
  onPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.container}
        activeOpacity={0.8}
      >
        <CheckBox size={22} borderColor="#ccc" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.category, { color: categoryColor }]}>
            {category}
          </Text>
        </View>
      </TouchableOpacity>

      {subtasks && subtasks.length > 0 && (
        <View style={styles.subtasksContainer}>
          {subtasks.map((sub, index) => (
            <View key={index} style={styles.subtask}>
              <CheckBox size={18} borderColor="#ccc" />
              <Text style={styles.subtaskText}>{sub.title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginLeft: 4,
    marginBottom: 4,
  },
  subtasksContainer: {
    marginLeft: 34,
    marginTop: 6,
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 5,
    marginBottom: 20,
  },
});
