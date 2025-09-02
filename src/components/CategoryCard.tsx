// src/components/CategoryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

interface CategoryCardProps {
  icon: string;
  count: number;
  title: string;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  count,
  title,
  color,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.CategoryRow}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minHeight: 90,
    justifyContent: 'center',
  },
  CategoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 1,
    marginLeft: 4,
  },
});
