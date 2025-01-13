import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { ClientPayload } from '@/utils/routes/routes.clients.service';
import { TextInput } from '../commons/input/input.component';
import { Checkbox, Column, ModalAddress, Row, Text } from '../commons';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Colors, scaleSize } from '@/utils';
import dayjs from 'dayjs';
import { Calendar } from '../commons/calendar/calendar.component';
import { ClientStatus } from '@/utils/enum/status.enum';

interface ClientFormProps {
  formik: FormikProps<ClientPayload>;
  isEditable?: boolean;
  clientId: string;
}

export const ClientForm = ({ formik, isEditable, clientId }: ClientFormProps) => {
  const FORMAT_DATE = 'DD/MM/YYYY';
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleLocationSelect = (selectedLocation: { latitude: number; longitude: number }, selectedAddress: string | null) => {
    formik.setFieldValue('address', selectedAddress ?? '');
    formik.setFieldValue('latitude', selectedLocation.latitude);
    formik.setFieldValue('longitude', selectedLocation.longitude);
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDateChange = (date: Date, setFieldValue: (field: string, value: unknown) => void) => {
    setFieldValue('nextVisit', date);
  };

  const nextVisitDate = formik.values.nextVisit ? formik.values.nextVisit : new Date();
  const formattedDate = dayjs(nextVisitDate).format(FORMAT_DATE);

  const handleCheckCompetence = () => {
    setIsChecked(!isChecked);
    formik.setFieldValue('status', ClientStatus.COMPETENCE);
  };

  return (
    <>
      <TextInput
        label="Cliente"
        placeholder="Nombre del local"
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        value={formik.values.name}
        editable={isEditable}
        error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
      />
      {!clientId && (
        <Row alignItems="center" gap={4}>
          <Checkbox isChecked={isChecked} onPress={handleCheckCompetence} fillColor={Colors.SKY_BLUE} />
          <Text fontSize={12}>Cliente de la competencia</Text>
        </Row>
      )}
      <TextInput
        label="Empresa actual"
        placeholder="Nombre de la empresa"
        onChangeText={formik.handleChange('competenceName')}
        onBlur={formik.handleBlur('competenceName')}
        value={formik.values.competenceName}
        editable={isEditable && isChecked}
        error={formik.touched.competenceName && formik.errors.competenceName ? formik.errors.competenceName : ''}
      />
      <Column gap={8}>
        <TextInput
          label="Dirección"
          placeholder="Nombre de la calle"
          onChangeText={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          value={formik.values.address}
          editable={isEditable}
          error={formik.touched.address && formik.errors.address ? formik.errors.address : ''}
        />
        {isEditable && (
          <Pressable disabled={!isEditable} onPress={() => setShowModal(true)}>
            <Row alignItems="center">
              <Ionicons name="location-outline" size={16} />
              <Text underline fontSize={12} fontWeight={500}>
                Marcar en el mapa
              </Text>
            </Row>
          </Pressable>
        )}
      </Column>
      <Row gap={8}>
        <TextInput
          label="Departamento"
          placeholder="..."
          onChangeText={formik.handleChange('department')}
          onBlur={formik.handleBlur('department')}
          value={formik.values.department}
          editable={isEditable}
          error={formik.touched.department && formik.errors.department ? formik.errors.department : ''}
          container={styles.input}
        />
        <TextInput
          label="Barrio"
          placeholder="..."
          onChangeText={formik.handleChange('neighborhood')}
          onBlur={formik.handleBlur('neighborhood')}
          value={formik.values.neighborhood}
          editable={isEditable}
          error={formik.touched.neighborhood && formik.errors.neighborhood ? formik.errors.neighborhood : ''}
          container={styles.input}
        />
      </Row>
      <Row gap={8}>
        <TextInput
          label="Contacto"
          placeholder="+598123465"
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            formik.setFieldValue('phone', numericText);
          }}
          onBlur={formik.handleBlur('phone')}
          keyboardType="number-pad"
          value={formik.values.phone}
          editable={isEditable}
          error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
          container={styles.input}
        />
        <TextInput
          label="Contacto Adicional"
          placeholder="+598123465"
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            formik.setFieldValue('additionalContact', numericText);
          }}
          onBlur={formik.handleBlur('additionalContact')}
          keyboardType="number-pad"
          value={formik.values.additionalContact}
          editable={isEditable}
          error={formik.touched.additionalContact && formik.errors.additionalContact ? formik.errors.additionalContact : ''}
          container={styles.input}
        />
      </Row>
      <TextInput
        label="Referente"
        placeholder="Nombre del referente"
        onChangeText={formik.handleChange('managerName')}
        onBlur={formik.handleBlur('managerName')}
        value={formik.values.managerName}
        editable={isEditable}
        error={formik.touched.managerName && formik.errors.managerName ? formik.errors.managerName : ''}
      />
      <TextInput
        label="R.U.T/CI"
        placeholder="Escribir..."
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, '');
          formik.setFieldValue('rut', numericText);
        }}
        keyboardType="number-pad"
        onBlur={formik.handleBlur('rut')}
        value={formik.values.rut}
        editable={isEditable}
        error={formik.touched.rut && formik.errors.rut ? formik.errors.rut : ''}
      />
      <Pressable onPress={handleOpen} disabled={!isEditable}>
        <Text style={styles.calendar_label}>Proxima Visita</Text>
        <View style={isEditable ? styles.calendar_input_container : styles.inputDisabled}>
          <RNTextInput placeholder={FORMAT_DATE} value={formattedDate} editable={false} style={styles.calendar_input} />
        </View>
        {formik.touched.nextVisit && formik.errors.nextVisit ? (
          <Text fontSize={12} fontWeight={300} textColor={Colors.error}>
            {formik.errors.nextVisit}
          </Text>
        ) : null}
      </Pressable>

      {showModal && isEditable && (
        <ModalAddress showModal={showModal} setShowModal={setShowModal} onLocationSelect={handleLocationSelect} />
      )}
      {isEditable && (
        <Calendar
          isVisible={open}
          date={new Date()}
          onDateChange={(date) => onDateChange(date, formik.setFieldValue)}
          onClose={handleClose}
          setOpen={setOpen}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    height: scaleSize(44),
    borderColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
  input: {
    flex: 1,
  },
});
