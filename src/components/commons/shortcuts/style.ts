import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shortcuts: {
    borderRadius: scaleSize(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    padding: 12,
    paddingVertical: 20,
    minHeight: 150,
    position: 'relative',
    marginTop: 12,
    width: '100%',
  },
  shortcuts_image_container: {
    backgroundColor: Colors.white,
    width: scaleSize(55),
    height: scaleSize(55),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcuts_item_button: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'center',
    paddingHorizontal: 8,
    borderRadius: 100,
    height: scaleSize(32),
    width: scaleSize(65),
    backgroundColor: Colors.white,
    position: 'absolute',
    right: 20,
    bottom: 12,
    zIndex: 99,
  },
  clients_status: {
    marginTop: 12,
  },
  statusRow: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 100,
  },
  contentContainer: {
    paddingBottom: 150,
    marginHorizontal: 12,
  },
});

export default styles;
