import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFormik } from 'formik';

import { Colors } from '@/utils/constants/Colors';
import { AuthRoutesLink } from '@/utils';
import { Button, Column, CustomModal, Text, TextInput } from '../commons';
import { HomeRoutesLink } from '@/utils/routes/routes.clients';
import { initialValues, validationSchema } from '@/utils/validations';
import { useAuthStore } from '@/zustand/auth/auth.store';
import { useUserStore } from '@/zustand/user/user.store';
import { useClientStore } from '@/zustand/client/client.store';

const LoginForm: React.FC = () => {
  const { login, loading } = useAuthStore();
  const { getUser } = useUserStore();
  const { getClients } = useClientStore();
  const [showModalError, setShowModalError] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    onSubmit: async (payload) => {
      Keyboard.dismiss();
      setShowModalError(false);
      try {
        await login({
          email: payload.email,
          password: payload.password,
        });

        await getUser();
        await getClients();
        formik.resetForm();
        router.replace(HomeRoutesLink.HOME);
      } catch (err) {
        setShowModalError(true);
      }
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInputs}>
          <View>
            <TextInput
              label="Dirección de correo"
              placeholder="Escribe tu correo"
              value={formik.values.email}
              error={formik.errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => formik.setFieldValue('email', text)}
            />
          </View>

          <View>
            <TextInput
              label="Contraseña"
              placeholder="Escribe tu contraseña"
              secureTextEntry={true}
              value={formik.values.password}
              error={formik.errors.password}
              autoCapitalize="none"
              maxLength={20}
              onChangeText={(text) => formik.setFieldValue('password', text)}
            />
          </View>
        </View>

        <Column style={styles.button_container} gap={24}>
          <Button loading={loading} error={Object.keys(formik.errors).length > 0} onPress={formik.handleSubmit} size="lg">
            Ingresar
          </Button>

          <Link style={styles.textForgotPassword} href={AuthRoutesLink.FORGOT_PASSWORD}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Column>
      </View>
      <CustomModal
        isVisible={showModalError}
        title="No pudimos iniciar sesión"
        onClose={() => setShowModalError(false)}
        content={
          <Text textColor={Colors.black}>
            Parece que hubo un problema con tu email o contraseña. Por favor, verifica tus datos e intenta de nuevo.
          </Text>
        }
      />
    </>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  containerInputs: {
    gap: 12,
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

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  button_container: {
    marginTop: 24,
  },
});
