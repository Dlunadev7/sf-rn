import React from 'react';
import { View } from 'react-native';
import { WrapperProps } from './wrapper.type';
import { styles } from './wrapper.style';

export const Wrapper = ({ children, style }: WrapperProps) => {
  return <View style={[styles.wrapper, style]}>{children}</View>;
};
