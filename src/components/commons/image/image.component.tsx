import React from 'react';
import { Image as RNImage, View, ImageStyle, ViewStyle } from 'react-native';
import { CustomImageProps } from './image.type';
import styles from './image.style';

export const Image = (props: CustomImageProps) => {
  const { borderRadius, width, height, source, style } = props;
  return (
    <View style={[{ borderRadius, width, height } as ViewStyle]}>
      <RNImage
        source={source}
        style={[
          styles.image,
          { borderRadius, width, height } as ImageStyle,
          style,
        ]}
        {...props}
      />
    </View>
  );
};
