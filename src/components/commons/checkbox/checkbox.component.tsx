import { Colors } from '@/utils';
import React from 'react';
import { StyleSheet } from 'react-native';
import RNCheckbox from 'react-native-bouncy-checkbox';

interface CustomCheckboxProps {
  size?: number;
  fillColor?: string;
  unFillColor?: string;
  isChecked: boolean;
  onPress: (isChecked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = (props: CustomCheckboxProps) => {
  const { fillColor, unFillColor, isChecked, onPress, disabled = false } = props;

  return (
    <RNCheckbox
      style={styles.checkbox}
      size={16}
      fillColor={fillColor}
      unFillColor={unFillColor}
      isChecked={isChecked}
      onPress={onPress}
      innerIconStyle={styles.innerIconCheckbox}
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 16,
  },
  innerIconCheckbox: {
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.SKY_BLUE,
  },
});
