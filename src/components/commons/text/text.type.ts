import { TextStyle } from 'react-native';

export type TextProps = {
  disabled?: boolean;
  textColor?: string;
  underline?: boolean;
  fontSize?: number;
  fontWeight?: TextStyle['fontWeight'];
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  style?: TextStyle;
  maxLength?: number;
};
