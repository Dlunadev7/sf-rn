import React from 'react';
import { HeaderRight } from './header-right.component';
import { HeaderLeft } from './header-left.component';
import { Colors } from '@/utils';
import styles from './style';
import { Row } from '@/components/commons';

export default function CustomHomeHeader() {
  return (
    <Row justifyContent="space-between" alignItems="center" style={styles.home_header_container}>
      <HeaderLeft />
      <HeaderRight
        icon={{
          color: Colors.black,
          size: 32,
        }}
      />
    </Row>
  );
}
