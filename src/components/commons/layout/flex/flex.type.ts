import { ViewStyle } from 'react-native';

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  style?: ViewStyle;
}
