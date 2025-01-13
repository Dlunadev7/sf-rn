import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  home_header_left_container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },

  home_header_left_logo: {
    height: scaleSize(46),
    width: scaleSize(123),
  },

  home_header_right_container: {
    alignItems: 'center',
    paddingRight: 12,
  },

  home_header_container: {
    height: scaleSize(100),
    width: '100%',
    backgroundColor: Colors.white,
    paddingTop: 48,
  },
});

export default styles;
