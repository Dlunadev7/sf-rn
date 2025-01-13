import { StyleProp, ViewStyle } from 'react-native';

export interface ColumnProps {
  children: React.ReactNode;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  style?: StyleProp<ViewStyle>;
}
