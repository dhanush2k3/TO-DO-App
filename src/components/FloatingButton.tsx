// src/components/FloatingButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

interface FloatingButtonProps {
  onPress?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 28,
  },
});
