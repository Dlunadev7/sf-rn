import React, { useState } from 'react';
import { Row } from '@/components/commons';
import { HeaderLeft } from './header-left.component';
import { HeaderRight } from './header-right.component';
import styles from './style';

export default function CustomClientHeader() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  return (
    <Row justifyContent="space-between" alignItems="center" style={styles.custom_header}>
      <HeaderLeft />
      <HeaderRight isFilterVisible={isFilterVisible} setIsFilterVisible={setIsFilterVisible} />
    </Row>
  );
}
