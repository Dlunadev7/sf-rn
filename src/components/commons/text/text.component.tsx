import React, { useState } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { Colors, scaleSize } from '@/utils';
import { TextProps } from './text.type';
import styles from './styles';

export const Text = (props: RNTextProps & TextProps) => {
  const {
    underline = false,
    fontSize = 14,
    textColor = Colors.text,
    textAlign,
    fontWeight = '300',
    transform = 'none',
    style,
    onPress,
    children,
    maxLength,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const textDecoration = underline ? 'underline' : 'none';

  let displayedText = children as string;
  if (maxLength && !isExpanded && displayedText.length > maxLength) {
    displayedText = `${displayedText.substring(0, maxLength)}`;
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <RNText
      onPress={onPress}
      allowFontScaling={false}
      style={[
        {
          color: textColor,
          textDecorationLine: textDecoration,
          fontSize: scaleSize(fontSize),
          textAlign,
          fontWeight: fontWeight,
          textTransform: transform,
        },
        style,
      ]}
    >
      {displayedText}
      {maxLength && !isExpanded && (children as string).length > maxLength && (
        <RNText onPress={() => handleToggleExpand()} style={styles.more}>
          ...mas
        </RNText>
      )}
    </RNText>
  );
};
