import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import AuthStorageService from '@/zustand/auth/auth.storage';

const Main = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AuthStorageService.getItem('token');
      setToken(storedToken);
      setLoading(false);
    };

    fetchToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
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
  );
};

export default Main;
