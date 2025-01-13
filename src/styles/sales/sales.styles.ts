import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    backgroundColor: Colors.white,
  },
  calendar_input: {
    color: Colors.black,
  },
  button_group: {
    paddingHorizontal: 12,
    marginVertical: 32,
    width: '100%',
  },
  card: {
    height: 'auto',
    width: '100%',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_container: {
    width: '100%',
  },
  card_description: {
    marginTop: 12,
  },
  card_content_container: {
    width: '100%',
  },
  group: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GRAY,
  },
  input_error_message: {
    marginTop: 8,
  },
  custom_input: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GRAY,
    textAlign: 'center',
  },
  camera_pressable: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.LIGHT_BLUE,
  },
  camera: {
    height: 250,
  },
  input: {
    flex: 1,
  },
});
