import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import LoginForm from '@/components/forms/LoginForm';
import Logo from '@/components/Logo';
import { Center, KeyboardContainer } from '@/components/commons';
import AuthStorageService from '@/zustand/auth/auth.storage';
import { Redirect } from 'expo-router';

const LoginScreen = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>();
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AuthStorageService.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };

    fetchToken();
  }, [token, setToken]);

  if (token) return <Redirect href={'/(tabs)/'} />;

  if (loading) {
    return (
      <Center>
        <ActivityIndicator size="large" color="#0000ff" />
      </Center>
    );
  }

  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <Logo />
        <LoginForm />
      </View>
    </KeyboardContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    justifyContent: 'center',
  },
});
