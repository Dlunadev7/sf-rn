import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '@/utils';
import { Text } from '../text/text.component';
import styles from './note.style';
import { NoteModal } from '../note-modal/note-modal.component';
import { useNoteStore } from '@/zustand/notes/notes.store';

interface NoteProps {
  label: string;
  addNote: (newNote: { title: string; description: string; date: Date }) => void;
  clientId: string;
}

interface FormValues {
  noteName: string;
  noteContent: string;
  noteDate: Date;
}

const validationSchema = Yup.object().shape({
  noteName: Yup.string().required('El nombre de la nota es obligatorio'),
  noteContent: Yup.string().required('El contenido de la nota es obligatorio'),
  noteDate: Yup.string().when('assignDate', (assignDate, schema) => {
    if (assignDate) return Yup.string().required('La fecha es obligatoria si se asigna');
    return schema;
  }),
});

export const Note = ({ label, addNote, clientId }: NoteProps) => {
  const initialValues: FormValues = {
    noteName: '',
    noteContent: '',
    noteDate: new Date(),
  };

  const createNote = useNoteStore((state) => state.createNote);
  const [showModal, setShowModal] = useState(false);

  const handleCreateNote = async (payload: { title: string; description: string; date: Date; client: { id: string } }) => {
    await createNote(payload);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => {}}>
      {({ values, errors: formikErrors, touched, handleChange, setFieldValue, resetForm, handleSubmit, setErrors }) => {
        return (
          <View>
            <Text fontSize={14} fontWeight={300} textColor={Colors.black} style={styles.label}>
              {label}
            </Text>

            <Pressable style={styles.pseudoInput} onPress={() => setShowModal(true)}>
              <Text fontWeight={600} textColor={Colors.white} fontSize={14}>
                + Nueva Nota
              </Text>
            </Pressable>

            <NoteModal
              isVisible={showModal}
              onClose={() => {
                setShowModal(false);
                resetForm();
              }}
              noteName={values.noteName}
              noteContent={values.noteContent}
              noteDate={values.noteDate}
              onNoteNameChange={handleChange('noteName')}
              onNoteContentChange={handleChange('noteContent')}
              onAssignDateChange={(checked: boolean) => setFieldValue('assignDate', checked)}
              onNoteDateChange={(date: Date) => setFieldValue('noteDate', date)}
              onConfirm={() => {
                const emptyFields: { [key in keyof FormValues]?: string } = {};

                if (!values.noteName.trim()) {
                  emptyFields.noteName = 'El nombre de la nota es obligatorio';
                }
                if (!values.noteContent.trim()) {
                  emptyFields.noteContent = 'El contenido de la nota es obligatorio';
                }

                if (Object.keys(emptyFields).length > 0) {
                  setErrors(emptyFields);
                  return;
                }

                if (clientId) {
                  handleCreateNote({
                    title: values.noteName,
                    description: values.noteContent,
                    date: values.noteDate,
                    client: { id: clientId },
                  });
                  resetForm();
                  setShowModal(false);
                } else {
                  addNote({
                    title: values.noteName,
                    description: values.noteContent,
                    date: values.noteDate,
                  });
                  resetForm();
                  setShowModal(false);
                }
              }}
              errors={formikErrors}
            />
          </View>
        );
      }}
    </Formik>
  );
};
