import React from 'react';
import { Stack } from 'expo-router';
import { RouteRoutes } from '@/utils/routes/routes.route';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name={RouteRoutes.ROUTES} />
      <Stack.Screen name={RouteRoutes.ROUTE} />
    </Stack>
  );
};

export default _layout;
