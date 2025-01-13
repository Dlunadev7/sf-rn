import React from 'react';
import { View } from 'react-native';
import { ContainerProps } from './container.type';
import { styles } from './style';

export const Container = (props: ContainerProps) => {
  const {
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    gap,
    grow,
    style,
    children,
  } = props;
  return (
    <View
      style={[
        styles.container,
        {
          padding,
          margin,
          rowGap: gap,
          flexGrow: grow,
          paddingHorizontal,
          paddingVertical,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
