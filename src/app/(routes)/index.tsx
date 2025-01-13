import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Center, CustomModal, Flex, Row, Text } from '@/components/commons';
import { Colors, scaleSize } from '@/utils';
import { ArrowRight, Suitcase } from '../../../assets/svg';
import { router, useNavigation } from 'expo-router';
import { RouteRoutesLink } from '@/utils/routes/routes.route';
import { useRouteStore } from '@/zustand/routes/routes.store';
import { SellerResponse } from '@/services/routes.service';
import { Header } from '@/components/headers';
import { useUserStore } from '@/zustand/user/user.store';
import { useClientStore } from '@/zustand/client/client.store';

export default function Routes() {
  const navigator = useNavigation();
  const { routes, getRoutes } = useRouteStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>();
  const [loadSellerUsers, setLoadSellerUsers] = useState(false);
  const routesData = routes as SellerResponse;
  const user = useUserStore((state) => state.user);
  const { getUsersSellers, sellerClients } = useClientStore();
  const sellerData = sellerClients.result;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getRoutes(user.id!, 0, searchTerm);
      setLoading(false);
    };

    fetchData();
  }, [getRoutes, searchTerm, user.id]);

  const loadMoreClients = () => {
    if (page < (routesData.pagination?.totalPages ?? 0) - 1) return;
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getRoutes(user.id!, nextPage, searchTerm);
      return nextPage;
    });
  };

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(0);
  }, []);

  useEffect(() => {
    navigator.setOptions({
      header: () => <Header onSearchChange={handleSearchChange} searchTerm={searchTerm} showArrow={false} />,
    });
  }, [handleSearchChange, navigator, searchTerm]);

  useEffect(() => {
    setLoadSellerUsers(true);
    (async () => {
      if (selectedRoute) {
        getUsersSellers(selectedRoute);
      }
    })();
    setLoadSellerUsers(false);
  }, [getUsersSellers, selectedRoute]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        await getRoutes(user.id!, 0, searchTerm);
      };
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [getRoutes, user.id, searchTerm]);

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={Colors.black} />
      </Center>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.clients_container}>
        <Row alignItems="center" justifyContent="space-between" style={styles.client_tab_container}>
          <View style={styles.client_tab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
              Rutas
            </Text>
          </View>
        </Row>
        <FlatList
          data={routesData.result}
          style={styles.flatlist}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: RouteRoutesLink.ROUTE,
                    params: {
                      title: item.name,
                      routeID: item.id,
                    },
                  })
                }
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Text textColor={Colors.black} fontSize={14} fontWeight={300}>
                    {item.name}
                  </Text>
                  <Row gap={24}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsOpen(true);
                        setSelectedRoute(item.id);
                      }}
                    >
                      <Row gap={8}>
                        <Suitcase color={Colors.DARK_GRAY} />
                        <Text textColor={Colors.DARK_GRAY} fontSize={14} fontWeight={300}>
                          {item.totalSellers}
                        </Text>
                      </Row>
                    </TouchableOpacity>
                    <ArrowRight color={Colors.GRAY} width={24} height={24} />
                  </Row>
                </Flex>
              </TouchableOpacity>
            </>
          )}
          onEndReached={loadMoreClients}
          onEndReachedThreshold={0.2}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.primary} /> : null}
        />
      </View>
      <CustomModal
        isVisible={isOpen}
        title="Vendedores en esta ruta"
        onClose={() => setIsOpen(false)}
        content={
          <ScrollView style={styles.modalContent}>
            {loadSellerUsers ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              sellerData?.map((val, index) => (
                <View key={index} style={styles.userItem}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.userText}>{val?.userInfo.fullName ?? ''}</Text>
                </View>
              ))
            )}
          </ScrollView>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 32,
  },
  item: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: scaleSize(26.5),
    backgroundColor: Colors.white,
  },
  flatlist: {
    flex: 1,
  },
  client_status: {
    width: 16,
    height: 16,
    borderRadius: 20,
    borderWidth: 3,
  },
  clients_container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 120,
  },
  client_tab: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderStartEndRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'flex-start',
  },
  client_tab_container: {
    paddingRight: 12,
    backgroundColor: Colors.DEFAULT_BACKGROUND,
  },
  userPlaceholderContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    padding: 20,
    maxHeight: 300,
    borderRadius: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dot: {
    fontSize: 24,
    color: '#333',
    marginRight: 8,
  },
  userText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
