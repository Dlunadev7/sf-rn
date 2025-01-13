import React, { useState, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../text/text.component';
import { Colors } from '@/utils';
import styles from './style';

export const Counter = ({
  size = 24,
  fontSize = 20,
  maxCount,
  onChange,
  countValue = 1,
  disableDecrement,
}: {
  size?: number;
  fontSize?: number;
  maxCount?: number;
  countValue?: number;
  onChange: (count: number) => void;
  disableDecrement?: boolean;
}) => {
  const [count, setCount] = useState(countValue || 1);

  useEffect(() => {
    setCount(countValue);
  }, [countValue]);

  const increment = () => {
    setCount((prevCount) => {
      if (maxCount && prevCount >= maxCount) return prevCount;
      const newCount = prevCount + 1;
      onChange(newCount);
      return newCount;
    });
  };

  const decrement = () => {
    setCount((prevCount) => {
      if (prevCount > 1) {
        const newCount = prevCount - 1;
        onChange(newCount);
        return newCount;
      }
      return prevCount;
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={[styles.button, { width: size, height: size }]} onPress={decrement} disabled={disableDecrement}>
        <Text textColor={Colors.GRAY} fontSize={12}>
          -
        </Text>
      </Pressable>
      <Text fontSize={fontSize} fontWeight={700}>
        {count}
      </Text>
      <Pressable style={[styles.button, { width: size, height: size }]} onPress={increment}>
        <Text textColor={Colors.GRAY} fontSize={12}>
          +
        </Text>
      </Pressable>
    </View>
  );
};
