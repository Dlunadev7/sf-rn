import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface CenterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Center = ({ children, style }: CenterProps) => {
  return <View style={[styles.center, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
