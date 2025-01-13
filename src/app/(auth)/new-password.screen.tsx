import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '@/components/Logo';
import NewPasswordForm from '@/components/forms/NewPasswordForm';
import { KeyboardContainer } from '@/components/commons';

const NewPasswordScreen = () => {
  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <Logo />
        <NewPasswordForm />
      </View>
    </KeyboardContainer>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    justifyContent: 'center',
  },
});
