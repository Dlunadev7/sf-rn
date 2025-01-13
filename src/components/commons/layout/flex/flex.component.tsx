import React from 'react';
import { View } from 'react-native';
import { styles } from './flex.style';
import { FlexProps } from './flex.type';

export const Flex = (props: FlexProps) => {
  const { children, direction = 'row', justifyContent = 'flex-start', alignItems = 'flex-start', gap, style } = props;

  return <View style={[styles.flex, { flexDirection: direction, justifyContent, alignItems, gap }, style]}>{children}</View>;
};
