import React from 'react';
import { TouchableOpacity, StyleSheet, View, TextInput } from 'react-native';
import { Colors, scaleSize } from '@/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Row, Text } from '@/components/commons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Search } from '../../../../assets/svg';

type RouteParams = {
  params: {
    name?: string;
    id?: string;
  };
};

export const HeaderLeft = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { params, name: routeName } = route;

  if (routeName?.includes('productos') || !routeName) {
    return (
      <View style={styles.input_container}>
        <Search color={Colors.GRAY} />
        <TextInput style={styles.input} placeholder="Buscar Categoria..." placeholderTextColor={Colors.DARK_GRAY} />
      </View>
    );
  }

  return (
    <Row alignItems="center" gap={8} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
      </TouchableOpacity>

      {params?.id ? (
        <Text textColor={Colors.black} fontWeight={600}>
          Ficha del producto
        </Text>
      ) : (
        <View style={styles.input_container}>
          <Search color={Colors.GRAY} />
          <TextInput style={styles.input} placeholder="Buscar Cliente..." placeholderTextColor={Colors.DARK_GRAY} />
        </View>
      )}
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
  },
  input_container: {
    flex: 0.9,
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
