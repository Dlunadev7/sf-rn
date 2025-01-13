import React from 'react';
import { View } from 'react-native';
import styles from './style';
import { Logo } from '../../../../assets/svg';
import { scaleSize } from '@/utils';

export const HeaderLeft = () => {
  return (
    <View style={styles.home_header_left_container}>
      <Logo width={scaleSize(123)} height={scaleSize(46)} style={styles.home_header_left_logo} />
    </View>
  );
};
