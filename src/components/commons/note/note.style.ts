import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  pseudoInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: 8,
    height: scaleSize(44),
  },
  pseudoInputText: {
    fontSize: 16,
    color: Colors.LIGHT_GRAY,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 5,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    height: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default styles;
