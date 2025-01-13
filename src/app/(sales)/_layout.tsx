import React from 'react';
import { router, Stack } from 'expo-router';
import { SalesRoutes } from '@/utils/routes/sales.routes';
import { Colors } from '@/utils';
import { Header } from '@/components/headers';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={SalesRoutes.SALES}
        options={{
          headerShown: true,
          header: () => <Header onBackPress={() => router.back()} showArrow title="Nueva Venta" background={Colors.white} />,
        }}
      />
      <Stack.Screen
        name={SalesRoutes.SALES_DETAIL}
        options={{
          headerShown: true,
          header: () => <Header onBackPress={() => router.back()} showArrow title="Nueva Venta" background={Colors.white} />,
        }}
      />
      <Stack.Screen
        name={SalesRoutes.SALES_PAYMENT}
        options={{
          headerShown: true,
          header: () => <Header onBackPress={() => router.back()} showArrow title="Nueva Venta" background={Colors.white} />,
        }}
      />
    </Stack>
  );
};

export default _layout;
