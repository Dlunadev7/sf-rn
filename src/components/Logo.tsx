import React from 'react';
import { ImageStyle, StyleProp, StyleSheet } from 'react-native';

import { Logo as LogoSVG } from '../../assets/svg';
interface ILogo {
  style?: StyleProp<ImageStyle>;
}

const Logo: React.FC<ILogo> = ({ style }) => {
  return <LogoSVG style={[styles.logo, style]} width={170} height={64} />;
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
