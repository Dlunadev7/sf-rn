import { Center } from '@/components/commons';
import AuthStorageService from '@/zustand/auth/auth.storage';
import { useAuthStore } from '@/zustand/auth/auth.store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const _layout = () => {
  const [loading, setLoading] = useState(true);
  const { token: tokenFromStore } = useAuthStore();
  const [token, setToken] = useState(tokenFromStore);
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

  if (loading) {
    return (
      <Center>
        <ActivityIndicator size="large" color="#0000ff" />
      </Center>
    );
  }

  return (
    <GestureHandlerRootView>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {token ? (
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack>
    </GestureHandlerRootView>
  );
};

export default _layout;
