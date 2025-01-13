import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/utils';
import { ProductsRoute } from '@/utils/routes/products.routes';
import { HeaderLeft } from '@/components/headers/products/header-left.component';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={ProductsRoute.PRODUCTS}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={ProductsRoute.CATALOG}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={ProductsRoute.PRODUCT}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />
      <Stack.Screen
        name={ProductsRoute.PRODUCT_INFO}
        options={{
          headerLeft: () => <HeaderLeft />,
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.DEFAULT_BACKGROUND,
          },
        }}
      />
      <Stack.Screen
        name={ProductsRoute.LIST}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.DEFAULT_BACKGROUND,
          },
        }}
      />
      <Stack.Screen
        name={ProductsRoute.PRODUCT_LIST}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.DEFAULT_BACKGROUND,
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
