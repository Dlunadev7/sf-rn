import React, { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';

import { Colors } from '@/utils/constants/Colors';
import { Button, Column, CustomModal, Text, TextInput } from '../commons';
import { forgotPasswordValue, forgotPasswordSchema } from '@/utils/validations';
import { useAuthStore } from '@/zustand/auth/auth.store';

const ForgotPasswordForm = () => {
  const { recoveryPassword, loading } = useAuthStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const formik = useFormik({
    initialValues: forgotPasswordValue,
    validationSchema: forgotPasswordSchema,
    validateOnChange: true,
    onSubmit: async (payload) => {
      Keyboard.dismiss();
      try {
        await recoveryPassword(payload);
        setShowModal(true);
      } catch (err) {
        console.error('Error en el restablecimiento de contraseña:', err);
      }
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Column gap={12}>
          <TextInput
            label="Confirma tu correo"
            placeholder="example@hmail.com"
            value={formik.values.email}
            error={formik.errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => formik.setFieldValue('email', text)}
          />

          <Text fontSize={12} fontWeight={300} textColor={Colors.text}>
            Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
        </Column>

        <Column style={styles.button_group} gap={24}>
          <Button loading={loading} error={Object.keys(formik.errors).length > 0} onPress={formik.handleSubmit}>
            Enviar Codigo
          </Button>

          <Text fontSize={12} fontWeight={300} textAlign="center" onPress={() => router.back()}>
            Volver
          </Text>
        </Column>
      </View>
      {showModal && (
        <CustomModal
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
            router.back();
          }}
          title="¡Correo enviado exitosamente!"
          content={<Text>Por favor, revisa tu bandeja de entrada para verificar el mensaje.</Text>}
        />
      )}
    </>
  );
};

export default ForgotPasswordForm;

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
  button_group: {
    marginTop: 32,
  },
  buttonSubmit: {
    alignSelf: 'center',
  },
  textButtonBack: {
    color: Colors.text,
  },
  textForgotPassword: {
    height: 14,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14.06,
    textAlign: 'center',
    color: Colors.grey,
    textDecorationLine: 'underline',
  },
});
