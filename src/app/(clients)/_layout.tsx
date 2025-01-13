import React from 'react';
import { Stack } from 'expo-router';
import { ClientsRoutes } from '@/utils/routes/routes.clients';
import { Colors } from '@/utils';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={ClientsRoutes.CLIENTS}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={ClientsRoutes.CLIENT}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
