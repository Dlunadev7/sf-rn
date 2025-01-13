import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Row, Text } from '@/components/commons';
import { ArrowLeft } from '../../../../assets/svg';
import { Colors } from '@/utils';
import { router } from 'expo-router';

export function HeaderLeft() {
  return (
    <Row alignItems="center" gap={8}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft color={Colors.black} />
      </TouchableOpacity>
      <Text fontSize={16} fontWeight={600}>
        Recordatorios
      </Text>
    </Row>
  );
}
