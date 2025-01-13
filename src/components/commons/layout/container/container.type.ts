import { ViewStyle } from 'react-native';

export interface ContainerProps {
  children: React.ReactNode;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  gap?: number;
  style?: ViewStyle;
  grow?: number;
}
