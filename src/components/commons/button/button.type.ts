import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress: () => void;
  style?: {
    button?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
  };
  shadow?: boolean;
  loading?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: number;
  stretch?: boolean;
  iconPosition?: IconPosition;
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  type?: 'filled' | 'outlined' | 'text' | 'disabled';
  backgroundColor?: string;
  borderColor?: string;
  rounded?: boolean;
  textColor?: string;
}

export type IconPosition = 'left' | 'right';
