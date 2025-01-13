import React from 'react';
import { Image } from 'react-native';
import { AuthLogoImage } from '@/images/auth';
import { LogoProps } from './logo.type';

import styles from './logo.style';

export const Logo = ({ style }: LogoProps) => {
  return <Image source={AuthLogoImage} style={[styles.logo, style]} />;
};
