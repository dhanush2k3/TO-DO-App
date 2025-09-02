// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  date: string;
}

const Header: React.FC<HeaderProps> = ({ title, date }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 8,
  },
  date: {
    fontSize: 26,
    color: '#888',
  },
});
