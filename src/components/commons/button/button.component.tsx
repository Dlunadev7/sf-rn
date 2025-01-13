import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle, Pressable } from 'react-native';
import styles from './button.style';
import { Colors } from '@/utils';
import { ButtonProps } from './button.type';
import { Text } from '../text/text.component';
import { Row } from '../layout/row/row.component';

export const Button = (props: ButtonProps) => {
  const {
    children,
    onPress,
    style,
    shadow = false,
    loading = false,
    error,
    leftIcon,
    rightIcon,
    size = 'md',
    stretch = false,
    align = 'center',
    type = 'filled',
    backgroundColor,
    borderColor,
    radius,
    rounded,
    textColor,
  } = props;

  const containerStyle: StyleProp<ViewStyle> = [
    styles[size],
    stretch && styles.stretch,
    type === 'filled' && styles.filled,
    type === 'outlined' && styles.outlined,
    type === 'text' && styles.text,
    type === 'disabled' && styles.disabled,
    shadow && type !== 'text' && styles.shadowWrapper,
    error && styles.buttonError,
    backgroundColor ? { backgroundColor } : {},
    radius ? { borderRadius: radius } : { borderRadius: 30 },
    borderColor ? { borderColor } : {},
    rounded ? { alignSelf: 'flex-start' } : styles.button,
  ];

  const textColorDefafult = type === 'filled' ? Colors.white : Colors.black;

  return (
    <Pressable disabled={loading || error} style={[containerStyle, style?.button, style?.text]} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Row alignItems="center" justifyContent={align} gap={8}>
          {leftIcon && leftIcon}
          <Text textColor={textColor ? textColor : textColorDefafult} fontWeight={500} style={[style?.text]}>
            {children}
          </Text>
          {rightIcon && rightIcon}
        </Row>
      )}
    </Pressable>
  );
};
