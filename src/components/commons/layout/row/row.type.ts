import { ViewStyle } from 'react-native';

export interface RowProps {
  children: React.ReactNode;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  wrap?: 'wrap' | 'nowrap';
  gap?: number;
  style?: ViewStyle[] | ViewStyle;
}
