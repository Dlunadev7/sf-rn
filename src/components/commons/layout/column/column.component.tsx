import React from 'react';
import { View } from 'react-native';
import { ColumnProps } from './column.type';
import styles from './style';

export const Column = (props: ColumnProps) => {
  const { children, justifyContent = 'flex-start', alignItems = 'stretch', gap = 0, style } = props;

  return <View style={[styles.column, { justifyContent, alignItems, gap }, style]}>{children}</View>;
};
