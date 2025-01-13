import React, { ReactElement } from 'react';
import { Colors } from '@/utils';
import { StyleSheet, View } from 'react-native';

export default function ModalSplash({
  content,
  backgroundColor = Colors.RED,
}: {
  content: ReactElement | ReactElement[];
  backgroundColor?: string;
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.contentContainer}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    pointerEvents: 'auto',
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
});
