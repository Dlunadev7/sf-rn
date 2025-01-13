import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

interface CalendarProps {
  isVisible: boolean;
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  setOpen?: (open: boolean) => void;
}

const CalendarPickerIOS: React.FC<CalendarProps> = ({ isVisible, date, onDateChange, onClose, setOpen }) => {
  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    onDateChange(currentDate);
    setOpen && setOpen(false);
  };

  return (
    <Modal onBackdropPress={onClose} isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <DateTimePicker value={date} mode="date" display="inline" onChange={onChange} maximumDate={new Date()} />
      </View>
    </Modal>
  );
};

const CalendarPickerAndroid: React.FC<CalendarProps> = ({ isVisible, date, onDateChange, onClose, minDate, maxDate = new Date() }) => {
  useEffect(() => {
    if (isVisible) {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (event: unknown, selectedDate?: Date) => {
          const currentDate = selectedDate || date;
          onDateChange(currentDate);
          onClose();
        },
        mode: 'date',
        display: 'default',
        minimumDate: minDate,
        maximumDate: maxDate,
            });
    }
  }, [isVisible]);

  return null;
};

export const Calendar = (props: CalendarProps) => {
  const { setOpen, ...rest } = props;
  return Platform.OS === 'ios' ? <CalendarPickerIOS {...rest} setOpen={setOpen} /> : <CalendarPickerAndroid {...rest} />;
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
});
