import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Flex, Row, Slider, Text, User } from '@/components/commons';
import { slides } from '@/mockup/slide-data.mockup';
import { useUserStore } from '@/zustand/user/user.store';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Cart, Clients, Products, Routes } from '../../../assets/svg';
import { Colors } from '@/utils';
import { ClientsRoutesLink } from '@/utils/routes/routes.clients';
import { RouteRoutesLink } from '@/utils/routes/routes.route';
import { ProductsRoutesLink } from '@/utils/routes/products.routes';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import { router } from 'expo-router';
import { useOrderStore } from '@/zustand/order/order.store';
import { useRouteStore } from '@/zustand/routes/routes.store';
import { useClientStore } from '@/zustand/client/client.store';
import { ClientsResponse } from '@/utils/routes/routes.clients.service';
import { useCategoryStore } from '@/zustand/categories/categories.store';
import { RefreshControl } from 'react-native-gesture-handler';
import { useNoteStore } from '@/zustand/notes/notes.store';
import { useSocket } from '@/hooks/api/use-socket.hook';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/zustand/auth/auth.store';

const HomeScreen = () => {
  const socket = useSocket();
  const [refreshing, setRefreshing] = useState(false);
  const { setUserLocation } = useUserStore((state) => ({
    setUserLocation: state.setUserLocation,
  }));

  const user = useUserStore((state) => state.user);
  const { orders, fetchOrders } = useOrderStore();
  const { routes, getRoutes } = useRouteStore();
  const { clients, getClients } = useClientStore();
  const { getReminders } = useNoteStore();
  const { fetchCategories, pagination: CategoryPagination } = useCategoryStore();
  const token = useAuthStore((state) => state.token);
  const clientsData = clients as unknown as ClientsResponse;

  useEffect(() => {
    if (!socket || !token) return;

    socket.on('connect', () => {
      console.log('Socket conectado');
    });

    socket.on('user-location', (response) => {
      console.log('Respuesta del servidor:', response);
    });

    return () => {
      socket.off('connect');
      socket.off('user-location');
    };
  }, [socket, token]);

  useEffect(() => {
    if (!socket || !user.location?.latitude || !user.location?.longitude) return;

    socket.emit(
      'location',
      JSON.stringify({
        user: user.id,
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      }),
    );
  }, [socket, user.location?.latitude, user.location?.longitude, user.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      (async () => {
        await fetchOrders(
          {
            page: 0,
          },
          '',
        );
        await getRoutes(user?.id);
        await getClients();
        await fetchCategories(
          {
            itemsPerPage: 0,
            page: 0,
            order: 'ASC',
          },
          '',
        );
      })();
      await getReminders(user.id!);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return;
      }

      locationSubscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 50 }, (location) => {
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
      });
    };

    getLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [setUserLocation]);

  useEffect(() => {
    (async () => {
      await fetchOrders(
        {
          page: 0,
        },
        '',
      );
      await getRoutes(user?.id);
      await getClients();
      await fetchCategories(
        {
          itemsPerPage: 0,
          page: 0,
          order: 'ASC',
        },
        '',
      );
    })();
  }, [fetchCategories, fetchOrders, getClients, getRoutes]);
  const shortCutsSquares = [
    {
      title: 'Clientes',
      Icon: Clients,
      total: `${clientsData?.result?.filter((client) => !client.isOneTime).length} Clientes totales`,
      color: Colors.SKY_BLUE,
      route: ClientsRoutesLink.CLIENTS_DEFAULT,
    },
    {
      title: 'Rutas',
      Icon: Routes,
      total: `${routes.pagination?.total ?? 0} Rutas asignadas`,
      color: Colors.SKY_BLUE,
      route: RouteRoutesLink.ROUTES_DEFAULT,
    },
    {
      title: 'Catálogo',
      Icon: Products,
      total: `${CategoryPagination?.total ?? 0} Productos`,
      color: Colors.SKY_BLUE,
      route: ProductsRoutesLink.CATALOG,
    },
    {
      title: 'Órdenes',
      Icon: Cart,
      total: `${orders.pagination?.total ?? 0} Órdenes nuevas`,
      color: Colors.SKY_BLUE,
      route: OrdersRoutesLink.ORDERS_DEFAULT,
    },
  ];

  return (
    <LinearGradient colors={[Colors.white, Colors.white, Colors.LIGHT_BLUE]} locations={[0, 0.2, 1]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.GRAY} colors={[Colors.GRAY]} />}
      >
        <User />
        <Slider name="Recordatorios" data={slides} />
        <View style={styles.contentContainer}>
          <Text fontSize={16} fontWeight={600}>
            Novedades
          </Text>
          <Row wrap="wrap" gap={8} style={styles.new_container}>
            {shortCutsSquares.map(({ title, Icon, total, color, route }, index) => (
              <Pressable onPress={() => router.navigate(route as never)} style={styles.shortcutBox}>
                <Flex direction="column" key={index} style={styles.shortcutBox_container}>
                  <Icon width={44} height={44} color={color} />
                  <Text fontSize={14} textColor={color} fontWeight={600}>
                    {title}
                  </Text>
                  <Text fontSize={12} textColor={color}>
                    {total}
                  </Text>
                </Flex>
              </Pressable>
            ))}
          </Row>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    marginBottom: 150,
  },
  new_container: {
    marginTop: 16,
  },
  shortcutBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    // elevation: 1,
    gap: 8,
  },
  shortcutBox_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
