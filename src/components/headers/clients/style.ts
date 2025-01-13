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

  home_header_right_kebab: {
    padding: 8,
  },

  clients_header_container: {},

  clients_header_left_container: {},
  clients_header_right_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search_input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 200,
    height: 40,
    color: Colors.black,
  },
  custom_header: {
    height: scaleSize(100),
    width: '100%',
    paddingTop: 48,
    paddingHorizontal: 12,
  },
});

export default styles;
