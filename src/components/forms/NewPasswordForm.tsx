import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';

import { Colors } from '@/utils/constants/Colors';

import { Button, Column, Text, TextInput } from '../commons';
import { newPasswordSchema } from '@/utils/validations/auth/auth.validations';
import { newPasswordValue } from '@/utils/validations/auth/auth.values';
import { AuthRoutesLink } from '@/utils';

const NewPasswordForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: newPasswordValue,
    validationSchema: newPasswordSchema,
    validateOnChange: true,
    onSubmit: async (payload) => {
      Keyboard.dismiss();
      router.push(AuthRoutesLink.NEW_PASSWORD_SUCCESS);
    },
  });

  return (
    <View style={styles.container}>
      <Column gap={24}>
        <TextInput
          label="Nueva contraseña"
          placeholder="Escribe tu contraseña nueva"
          value={formik.values.password}
          error={formik.errors.password}
          secureTextEntry
          onChangeText={(text) => formik.setFieldValue('password', text)}
        />

        <TextInput
          label="Confirma tu nueva contraseña"
          placeholder="Repite tu contraseña nueva"
          value={formik.values.confirmPassword}
          error={formik.errors.confirmPassword}
          secureTextEntry
          onChangeText={(text) => formik.setFieldValue('confirmPassword', text)}
        />
      </Column>
      <Column style={styles.button_group} gap={24}>
        <Button style={{ button: styles.buttonSubmit }} error={Object.keys(formik.errors).length > 0} onPress={formik.handleSubmit}>
          Cambiar Contraseña
        </Button>

        <Text fontSize={12} fontWeight={300} textAlign="center" onPress={() => router.back()}>
          Volver
        </Text>
      </Column>
    </View>
  );
};

export default NewPasswordForm;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  text: {
    height: 42,
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 14.06,
    color: Colors.text,
  },
  buttonSubmit: {
    alignSelf: 'center',
  },
  buttonBack: {
    alignSelf: 'center',
    width: 164,
    backgroundColor: 'transparent',
  },
  textButtonBack: {
    color: Colors.text,
  },
  button_group: {
    marginTop: 32,
  },
});
