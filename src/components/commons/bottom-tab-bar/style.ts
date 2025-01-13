import { scaleSize } from '@/utils';
import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  homeLabelContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: -60,
    height: scaleSize(70),
    width: scaleSize(70),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabbar: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 5.46,
    elevation: 9,
    shadowOpacity: 0.3,
    width: Dimensions.get('window').width - 20,
    left: 10,
  },
});

export default styles;
