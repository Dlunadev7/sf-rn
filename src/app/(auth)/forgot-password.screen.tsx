import React from 'react';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import Logo from '@/components/Logo';
import { KeyboardContainer } from '@/components/commons';
import { StyleSheet, View } from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <Logo />
        <ForgotPasswordForm />
      </View>
    </KeyboardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    justifyContent: 'center',
  },
});

export default ForgotPasswordScreen;
