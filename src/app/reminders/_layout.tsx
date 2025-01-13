import React from 'react';
import { router, Stack } from 'expo-router';
import { Header } from '@/components/headers';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: '',
          header: () => <Header title="Recordatorios" showArrow onBackPress={() => router.back()} />,
        }}
      />
    </Stack>
  );
};

export default _layout;
