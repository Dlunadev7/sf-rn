import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    minWidth: scaleSize(147),
  },
  filled: {
    backgroundColor: Colors.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.DARK_GRAY,
  },
  buttonError: {
    backgroundColor: Colors.grey2,
  },
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  xl: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 18,
  },
  lg: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  md: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sm: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  stretch: {
    width: '100%',
  },
});

export default styles;
