import { Colors } from '@/utils/constants/Colors';
import React from 'react';
import { Text } from '../text/text.component';
import { Row } from '../layout/row/row.component';
import { View } from 'react-native';
import styles from './user.style';
import { useUserStore } from '@/zustand/user/user.store';

export const User = () => {
  const user = useUserStore((state) => state.user);

  return (
    <View style={styles.user_container}>
      <Row gap={8} alignItems="center">
        <Text fontSize={12} fontWeight={500} textColor={Colors.text}>
          Hola, {user?.fullName}!
        </Text>
      </Row>
    </View>
  );
};
