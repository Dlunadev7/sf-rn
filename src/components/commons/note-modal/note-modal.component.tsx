import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Column } from '../layout/column/column.component';
import { Text } from '../text/text.component';
import { Button } from '../button/button.component';
import { ButtonType } from '@/utils/types/button.type';
import styles from './note-modal.style';
import { TextInput } from '../input/input.component';
import { Colors } from '@/utils';
import { FormikErrors } from 'formik';

import dayjs from 'dayjs';
import { Calendar } from '../calendar/calendar.component';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  noteName: string;
  noteContent: string;
  noteDate: Date;
  onNoteNameChange: (text: string) => void;
  onNoteContentChange: (text: string) => void;
  onAssignDateChange: (checked: boolean) => void;
  onNoteDateChange: (text: Date) => void;
  errors: FormikErrors<{
    noteName: string;
    noteContent: string;
    noteDate: Date;
  }>;
  isEditMode?: boolean;
}

export const NoteModal = ({
  isVisible,
  onClose,
  onConfirm,
  noteName,
  noteContent,
  noteDate,
  onNoteNameChange,
  onNoteContentChange,
  onNoteDateChange,
  errors,
  isEditMode,
}: CustomModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal} useNativeDriver animationIn="fadeIn" animationOut="fadeOut">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <Column gap={12} style={styles.modalContent}>
            <Text fontSize={20} fontWeight={500}>
              Nota
            </Text>
            <Column gap={12}>
              <TextInput
                label="Nombre de la nota"
                placeholder="Escribir..."
                value={noteName}
                onChangeText={onNoteNameChange}
                placeholderTextColor={Colors.LIGHT_GRAY}
                error={errors.noteName}
              />
              <TextInput
                label="Contenido"
                placeholder="Escribir..."
                value={noteContent}
                onChangeText={onNoteContentChange}
                placeholderTextColor={Colors.LIGHT_GRAY}
                error={errors.noteContent}
              />
              <Pressable onPress={isEditMode ? () => {} : handleOpen}>
                <Text style={styles.calendar_label}>Fecha</Text>
                <View style={[styles.calendar_input_container, isEditMode && styles.inputDisabled]}>
                  <RNTextInput
                    placeholder="DD/MM/YYYY"
                    value={dayjs(noteDate).format('DD/MM/YYYY')}
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
              {onConfirm && (
                <Button
                  onPress={() => {
                    onConfirm();
                  }}
                >
                  Guardar
                </Button>
              )}
            </View>
          </Column>
        </ScrollView>
      </KeyboardAvoidingView>
      <Calendar isVisible={open} date={noteDate} onDateChange={onNoteDateChange} onClose={handleClose} setOpen={setOpen} />
    </Modal>
  );
};
