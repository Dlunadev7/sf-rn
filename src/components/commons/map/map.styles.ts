import { Colors } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: 'auto',
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  mapContainer: {
    height: 420,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 420,
  },
  addressContainer: {
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  modal_information: {
    padding: 12,
  },
});

export default styles;
