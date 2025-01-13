import React, { useState } from 'react';
import styles from './note.style';
import { Pressable, View } from 'react-native';
import { Text } from '../text/text.component';
import { Column } from '../layout/column/column.component';
import { Colors } from '@/utils';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { NoteModal } from '../note-modal/note-modal.component';
import { useNoteStore } from '@/zustand/notes/notes.store';
import { Edit, Trash } from '../../../../assets/svg';
import { Row } from '../layout/row/row.component';
import { CustomModal } from '../modal/modal.component';

const validationSchema = Yup.object().shape({
  noteName: Yup.string().required('El nombre de la nota es obligatorio').max(20, 'Maximo 20 caracteres'),
  noteContent: Yup.string().required('El contenido de la nota es obligatorio').max(200, 'Maximo 200 caracteres'),
  noteDate: Yup.string().when('assignDate', (assignDate, schema) => {
    if (assignDate) return Yup.string().required('La fecha es obligatoria si se asigna');
    return schema;
  }),
});

interface FormValues {
  noteName: string;
  noteContent: string;
  noteDate: Date;
}

export const NoteItem = ({
  title,
  description,
  date,
  id,
  removeNote,
}: {
  title: string;
  description: string;
  date: Date;
  id?: string;
  removeNote?: (noteTitle: string) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteNote, setShowDeleteNote] = useState(false);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const initialValues: FormValues = {
    noteName: title,
    noteContent: description,
    noteDate: date,
  };

  const handleDeleteNote = async () => {
    if (id) {
      await deleteNote(id);
    } else {
      removeNote?.(title);
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => {}}>
        {({ values, errors: formikErrors, touched, handleChange, setFieldValue, resetForm, handleSubmit, setErrors }) => (
          <>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text fontWeight={500} fontSize={16} textColor={Colors.text}>
                  {title}
                </Text>
                <Row alignItems="center" gap={8}>
                  <Pressable onPress={() => setShowModal(true)}>
                    <Edit color={Colors.DARK_GRAY} />
                  </Pressable>
                  <Pressable onPress={() => setShowDeleteNote(true)}>
                    <Trash color={Colors.DARK_GRAY} />
                  </Pressable>
                </Row>
              </View>
              <Column>
                <Text fontSize={12} fontWeight={300} textColor={Colors.DARK_GRAY}>
                  {description}
                </Text>
                {date && (
                  <Text fontSize={12} fontWeight={300} textColor={Colors.text} textAlign="right">
                    {dayjs(date).format('DD/MM/YYYY')}
                  </Text>
                )}
              </Column>
            </View>

            {/* Modal para editar la nota */}
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
                handleSubmit();

                if (Object.keys(formikErrors).length > 0) {
                  setErrors(emptyFields);
                } else {
                  updateNote(id!, {
                    title: values.noteName,
                    description: values.noteContent,
                    date: values.noteDate,
                  });
                  resetForm();
                  setShowModal(false);
                }
              }}
              errors={formikErrors}
              isEditMode={Boolean(id)}
            />
          </>
        )}
      </Formik>

      {/* Modal de confirmación para eliminar la nota */}
      {showDeleteNote && (
        <CustomModal
          isVisible={showDeleteNote}
          onClose={() => setShowDeleteNote(false)}
          title="Eliminar nota"
          content={<Text>Esta nota será eliminada de forma permanente. ¿Desea continuar?</Text>}
          onConfirm={() => {
            handleDeleteNote();
            setShowDeleteNote(false);
          }}
        />
      )}
    </>
  );
};
