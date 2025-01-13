import React, { useCallback } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Colors, scaleSize } from '@/utils';
import { Search } from '../../../../assets/svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Row, Text } from '@/components/commons';
import { Ionicons } from '@expo/vector-icons';
import { useClientStore } from '@/zustand/client/client.store';
import { router } from 'expo-router';

type RouteParams = {
  params: {
    name?: string;
    id?: string;
  };
};

export const HeaderLeft = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { searchTerm, setSearchTerm } = useClientStore();
  const { params, name: routeName } = route;

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const getTitle = () => {
    if (routeName?.includes('index') || !routeName) {
      return 'Clientes';
    }

    if (params?.name) {
      return (
        <Row alignItems="center" gap={8}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text textColor={Colors.black}>{params.name}</Text>
        </Row>
      );
    }

    if (params?.id) {
      return (
        <Row alignItems="center" gap={8}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text textColor={Colors.black}>Nuevo Cliente</Text>
        </Row>
      );
    }

    if (routeName?.includes('sales')) {
      return (
        <Row alignItems="center" gap={8}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text textColor={Colors.black}>Nueva venta</Text>
        </Row>
      );
    }
    if (routeName?.includes('routes')) {
      return (
        <Row alignItems="center" gap={8}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text textColor={Colors.black}>Rutas</Text>
        </Row>
      );
    }

    return (
      <View style={styles.input_container}>
        <Search color={Colors.GRAY} />
        <TextInput
          style={styles.input}
          placeholder="Buscar Cliente..."
          placeholderTextColor={Colors.DARK_GRAY}
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
      </View>
    );
  };

  return <>{getTitle()}</>;
};

const styles = StyleSheet.create({
  input_container: {
    flex: 0.95,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 100,
    height: scaleSize(32),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  input: {
    marginLeft: 12,
    width: '90%',
  },
});
