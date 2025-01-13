import { Colors, scaleSize } from '@/utils';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: height,
  },
  float_buttons: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 10,
    borderRadius: 100,
  },
  locateButton: {
    backgroundColor: Colors.LIGHT_BLUE,
    padding: 10,
    borderRadius: 100,
  },
  item: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: scaleSize(26.5),
    backgroundColor: Colors.white,
  },
  bottomSheet_content_container: {
    flex: 1,
    zIndex: 9999,
  },
  bottomSheet_container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  client_tab: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderStartEndRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'flex-start',
  },
  client_tab_container: {
    paddingRight: 12,
    backgroundColor: Colors.DEFAULT_BACKGROUND,
  },
  toggleButtonContainer: {},
  toggleButton: {
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 14,
    color: Colors.black,
  },
  closeTooltip: {
    marginTop: 5,
  },
  closeTooltipText: {
    fontSize: 12,
    color: 'blue',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.DARK_GRAY,
    marginVertical: 12,
  },
  item_text: {
    marginTop: 5,
  },
  arrow: {
    marginTop: 5,
  },
  input_group: {
    flex: 1,
  },
  input: {
    flex: 3,
  },
  callout: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    width: '100%',
  },
  arrow_callout: {
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default styles;
