// src/components/CheckBox.tsx
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

interface CheckBoxProps {
  initialChecked?: boolean;
  size?: number; // default 22
  borderColor?: string;
  tickColor?: string;
  onChange?: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  initialChecked = false,
  size = 22,
  borderColor = '#ccc',
  tickColor = '#000',
  onChange,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const toggleCheck = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderColor,
          borderRadius: size * 0.27,
        },
      ]}
      onPress={toggleCheck}
      activeOpacity={0.7}
    >
      {checked && (
        <Text
          style={{
            color: tickColor,
            fontSize: size * 0.8,
            lineHeight: size * 0.9,
          }}
        >
          ✓
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
