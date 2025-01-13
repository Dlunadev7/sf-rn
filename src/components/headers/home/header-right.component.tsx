import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { CustomModal, Text } from '@/components/commons';
import { useAuthStore } from '@/zustand/auth/auth.store';
import { AuthRoutesLink, Colors } from '@/utils';
import { router } from 'expo-router';

type HeaderRightProps = {
  icon: {
    color: string;
    size: number;
  };
};

export const HeaderRight = (props: HeaderRightProps) => {
  const { icon } = props;
  const [isVisible, setisVisible] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setisVisible(false);
    router.navigate({ pathname: AuthRoutesLink.LOGIN });
  };

  return (
    <>
      <Pressable onPress={() => setisVisible(true)} style={styles.home_header_right_container}>
        <Ionicons name="log-out-outline" size={icon.size} color={icon.color} />
      </Pressable>
      <CustomModal
        isVisible={isVisible}
        onClose={() => setisVisible(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        content={
          <Text textColor={Colors.GRAY} fontWeight={500} fontSize={14}>
            Estás a punto de cerrar tu sesión. ¿Estás seguro de que deseas continuar?
          </Text>
        }
      />
    </>
  );
};
