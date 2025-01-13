import { SVGProps } from 'react';
import { ColorValue, DimensionValue } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface StatusItem {
  label: string;
  color: ColorValue;
}

export interface SlideItemProps {
  backgroundColor: ColorValue;
  icon: React.FC<SVGProps<React.SVGProps<SVGSVGElement>>> | React.FC<SVGProps<SVGSVGElement>> | React.FC<SvgProps>;
  title: string;
  total: string;
  statusList?: StatusItem[];
  onPress: () => void;
  width?: DimensionValue;
}
