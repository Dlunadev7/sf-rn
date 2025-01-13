import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: 'auto',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkbox_wrapper: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  calendar_label: {
    color: Colors.text,
    marginBottom: 8,
  },
  calendar_input_container: {
    height: scaleSize(44),
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  calendar_input: {
    color: Colors.black,
  },
  inputDisabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
});

export default styles;
