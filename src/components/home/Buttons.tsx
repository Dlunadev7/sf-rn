import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import MyModalWarn from '@/components/modals/MyModalWarn';
import { useRouter } from 'expo-router';
import { Colors, scaleSize } from '@/utils';
import { Button, Column, Text, Wrapper } from '../commons';
import { ClientsRoutesLink } from '@/utils/routes/routes.clients';
import { useAuthStore } from '@/zustand/auth/auth.store';
import { ArrowRightOutlined, Clients, Orders, Products, Routes } from '../../../assets/svg';

const Buttons = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleModalVisible = () => {
    setModalVisible(true);
  };

  const handleLogout = () => {
    logout();
    setModalVisible(false);
    router.push('/(auth)');
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.routes_text} fontWeight={600} fontSize={16}>
        Acciones
      </Text>
      <View style={styles.container}>
        <Wrapper style={styles.bottom_container}>
          <View style={styles.bottom_container_content}>
            <Column gap={24}>
              <Button
                onPress={() => router.push(ClientsRoutesLink.CLIENTS)}
                size="xl"
                stretch
                align="space-between"
                leftIcon={<Clients color={Colors.white} />}
                rightIcon={<ArrowRightOutlined color={Colors.white} />}
                backgroundColor={Colors.RED}
              >
                Clientes
              </Button>
              <Button
                onPress={() => {}}
                size="xl"
                stretch
                align="space-between"
                leftIcon={<Orders color={Colors.white} />}
                rightIcon={<ArrowRightOutlined color={Colors.white} />}
                backgroundColor={Colors.RED}
              >
                Ordenes
              </Button>
              <Button
                onPress={() => {}}
                size="xl"
                stretch
                align="space-between"
                leftIcon={<Routes color={Colors.white} />}
                rightIcon={<ArrowRightOutlined color={Colors.white} />}
                backgroundColor={Colors.RED}
              >
                Rutas
              </Button>
              <Button
                onPress={() => {}}
                size="xl"
                stretch
                align="space-between"
                leftIcon={<Products color={Colors.white} />}
                rightIcon={<ArrowRightOutlined color={Colors.white} />}
                backgroundColor={Colors.RED}
              >
                Productos
              </Button>
            </Column>
            {/* <Text
            textAlign="center"
            fontWeight={500}
            fontSize={12}
            underline
            onPress={() => {
              handleModalVisible();
            }}
          >
            Finalizar Recorrido
          </Text> */}
          </View>
        </Wrapper>
        <MyModalWarn
          title="Está a punto de cerrar esta sesión. Desea continuar?"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPressConfirm={handleLogout}
        />
      </View>
    </View>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  bottom_container: {
    // borderTopRightRadius: 30,
    // justifyContent: 'flex-end',
    // backgroundColor: Colors.DARK_GRAY,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  bottom_container_content: {
    // width: '100%',
    // borderTopRightRadius: 50,
    // backgroundColor: Colors.LIGHT_GRAY,
    // paddingVertical: 32,
  },
  container: {
    // height: scaleSize(330),
    minHeight: scaleSize(300),
    height: 'auto',
  },
  routes_text: {
    marginBottom: 32,
  },
});
