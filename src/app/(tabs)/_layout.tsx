import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/commons/bottom-tab-bar/tab-bar.components';
import { FontAwesome } from '@expo/vector-icons';
import CustomClientHeader from '@/components/headers/clients/custom-header.component';
import CustomHomeHeader from '@/components/headers/home/custom-home-header';

const AppNavigator: React.FC = () => {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} initialRouteName="index">
      <Tabs.Screen name="ordenes" options={{ headerShown: false }} />
      <Tabs.Screen name="productos" options={{ headerShown: false }} />
      <Tabs.Screen
        name="index"
        options={{
          title: 'inicio',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerTitle: '',
          header: () => <CustomHomeHeader />,
        }}
      />
      <Tabs.Screen name="clientes" />
      <Tabs.Screen name="rutas" options={{ header: () => <CustomClientHeader /> }} />
    </Tabs>
  );
};

export default AppNavigator;
