import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    flex: 1,
    marginTop: 32,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  orders_header: {
    marginRight: 12,
  },
  orders_header_title: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  budgets_item: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
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
  },
  calendar_input: {
    color: Colors.black,
  },
  button_group: {
    paddingHorizontal: 12,
    marginVertical: 32,
    width: '100%',
  },
  flex_3: {
    flex: 3,
  },
  flex_1: {
    flex: 1,
  },
  flex_1_5: {
    flex: 2,
  },
  flex_2: {
    flex: 2,
  },
  input_error_message: {
    marginTop: 8,
  },
  product_container: {
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  product: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: scaleSize(44),
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#00000020',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 4,
  },
  cross: {
    marginRight: 8,
  },
  product_disabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
  calendar_input_disabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
});
