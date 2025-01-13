import { Colors } from '@/utils';
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  absoluteContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handle: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  gesture_handler_container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  drag_line: {
    width: 48,
    height: 2,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 100,
    marginTop: 4,
  },
  backdrop: {
    backgroundColor: 'transparent',
  },
});

export default styles;
