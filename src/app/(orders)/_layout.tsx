import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/utils';
import CustomClientHeader from '@/components/headers/clients/custom-header.component';
import { OrdersRoutes } from '@/utils/routes/orders.routes';

const OrdersLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={OrdersRoutes.ORDERS}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          header: () => <CustomClientHeader />,
        }}
      />
      <Stack.Screen
        name={OrdersRoutes.ORDERS_BUDGET}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />

      <Stack.Screen
        name={OrdersRoutes.ORDERS_BUDGET_ID}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />

      <Stack.Screen
        name={OrdersRoutes.ORDERS_CLIENTS}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={OrdersRoutes.ORDERS_CLIENTS_ID}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={OrdersRoutes.DIRECT_SALE}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={OrdersRoutes.ORDERS_BUDGET_LIST}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
    </Stack>
  );
};

export default OrdersLayout;
