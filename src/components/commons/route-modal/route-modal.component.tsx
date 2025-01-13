import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Column } from '../layout/column/column.component';
import { Text } from '../text/text.component';
import { Button } from '../button/button.component';
import { ButtonType } from '@/utils/types/button.type';
import styles from './route-modal.style';
import { TextInput } from '../input/input.component';
import { Colors } from '@/utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { Calendar } from '../calendar/calendar.component';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: { noteName: string; noteContent: string; noteDate: Date }) => void;
  isEditMode?: boolean;
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  noteName: Yup.string().required('El nombre es requerido'),
  noteContent: Yup.string().required('El contenido es requerido'),
  noteDate: Yup.date().required('La fecha es requerida'),
});

export const RouteModal = ({ isVisible, onClose, onSubmit, isEditMode }: CustomModalProps) => {
  const [open, setOpen] = useState(false);
  const [noteDate, setNoteDate] = useState(new Date());

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formattedDate = 'DD/MM/YYYY';

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal} useNativeDriver animationIn="fadeIn" animationOut="fadeOut">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <Formik
            initialValues={{ noteName: 'Cliente Pendiente', noteContent: '', noteDate: new Date() }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit(values);
              onClose();
            }}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <Column gap={12} style={styles.modalContent}>
                <Text fontSize={20} fontWeight={500}>
                  Cliente Pendiente
                </Text>
                <Column gap={12}>
                  <TextInput
                    label="Nombre de la nota"
                    placeholder="Escribir..."
                    value={values.noteName}
                    onChangeText={handleChange('noteName')}
                    placeholderTextColor={Colors.LIGHT_GRAY}
                    error={errors.noteName}
                    editable={false}
                  />
                  <TextInput
                    label="Contenido"
                    placeholder="Razon del estado pendiente..."
                    value={values.noteContent}
                    onChangeText={handleChange('noteContent')}
                    placeholderTextColor={Colors.LIGHT_GRAY}
                    error={errors.noteContent}
                  />
                  <Pressable onPress={isEditMode ? () => {} : handleOpen}>
                    <Text style={styles.calendar_label}>Fecha</Text>
                    <View style={[styles.calendar_input_container, isEditMode && styles.inputDisabled]}>
                      <RNTextInput
                        placeholder={formattedDate}
                        value={dayjs(noteDate).format(formattedDate)}
                        editable={false}
                        style={[styles.calendar_input]}
                      />
                    </View>
                  </Pressable>
                </Column>
                <View style={styles.buttonContainer}>
                  <Button onPress={onClose} type={ButtonType.TEXT}>
                    Cancelar
                  </Button>
                  <Button onPress={handleSubmit}>Guardar</Button>
                </View>
              </Column>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <Calendar
        isVisible={open}
        date={noteDate}
        onDateChange={(date) => {
          setNoteDate(date);
        }}
        onClose={handleClose}
        setOpen={setOpen}
      />
    </Modal>
  );
};
