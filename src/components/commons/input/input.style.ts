import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input_container: {
    flexDirection: 'column',
  },
  input_content_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.DARK_GRAY,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: scaleSize(44),
    backgroundColor: Colors.white,
  },
  input: {
    width: '80%',
    borderColor: 'transparent',
    color: Colors.black,
    fontWeight: 'normal',
  },
  inputFocus: {
    borderWidth: 2,
  },
  label: {
    color: Colors.LIGHT_BLACK,
    marginBottom: 8,
  },
  input_error_message: {
    marginTop: 8,
  },
  inputDisabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
  left_icon: {
    paddingRight: 12,
  },
});
