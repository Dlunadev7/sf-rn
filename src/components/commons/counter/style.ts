import { Colors } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.LIGHT_GRAY,
    width: 32,
    height: 32,
    borderRadius: 100,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default styles;
