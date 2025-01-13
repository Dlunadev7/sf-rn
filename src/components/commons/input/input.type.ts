import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export interface InputProps extends TextInputProps {
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  backgroudDisabled?: boolean;
  styleContainer?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
}
