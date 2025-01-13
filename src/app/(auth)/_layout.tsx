import React from 'react';
import { Stack } from 'expo-router';
import { AuthRoutes } from '@/utils';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthRoutes.LOGIN} options={{ headerShown: false }} />
      <Stack.Screen name={AuthRoutes.FORGOT_PASSWORD} options={{ headerShown: false }} />
      <Stack.Screen name={AuthRoutes.NEW_PASSWORD} />
      {/* <Stack.Screen name={AuthRoutes.NEW_PASSWORD_SUCCESS} /> */}
    </Stack>
  );
};

export default _layout;
