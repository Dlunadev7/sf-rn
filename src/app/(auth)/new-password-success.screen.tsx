import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Logo from '@/components/Logo';
import { Colors } from '@/utils/constants/Colors';

const NewPasswordSuccessScreen = () => {
  return (
    <View style={styles.container}>
      <Logo />

      <View style={styles.containerText}>
        <Text style={styles.title}>¡Contraseña actualizada con éxito!</Text>
        <Text style={styles.message}>
          Tu contraseña ha sido cambiada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
        </Text>
      </View>
    </View>
  );
};

export default NewPasswordSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerText: {
    flex: 1,
    gap: 31,
    alignSelf: 'center',
    width: 276.58,
  },

  title: {
    height: 48,
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.text,
  },

  message: {
    height: 48,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16.41,
    textAlign: 'center',
    color: Colors.text,
  },

  button: {
    alignSelf: 'center',
    width: 147,
  },
});
