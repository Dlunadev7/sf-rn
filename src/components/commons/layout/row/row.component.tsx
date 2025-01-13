import React from 'react';
import { View } from 'react-native';
import { RowProps } from './row.type';
import styles from './style';

export const Row = (props: RowProps) => {
  const { children, justifyContent = 'flex-start', alignItems = 'flex-start', gap = 0, wrap = 'nowrap', style } = props;

  return <View style={[styles.row, { justifyContent, alignItems, gap, flexWrap: wrap }, style]}>{children}</View>;
};
