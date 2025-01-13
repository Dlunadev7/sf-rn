import { ImageProps, ImageStyle, StyleProp } from 'react-native';

export interface CustomImageProps extends Omit<ImageProps, 'style'> {
  borderRadius?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}
