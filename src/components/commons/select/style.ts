import { Colors } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    width: 150,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
