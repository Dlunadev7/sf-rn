import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { ClientsRoutesLink } from '@/utils/routes/routes.clients';
import { Button, Flex, Row, Text } from '@/components/commons';
import { Colors, scaleSize } from '@/utils';
import { StatusBar } from 'expo-status-bar';
import { useClientStore } from '@/zustand/client/client.store';
import { ClientsResponse } from '@/utils/routes/routes.clients.service';
import { Add, ArrowRight, Clock } from '../../../assets/svg';
import dayjs from 'dayjs';
import { Header } from '@/components/headers';
import { ClientStatus } from '@/utils/enum/status.enum';

export default function ClientsView() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | undefined | string | null>();
  const navigator = useNavigation();

  const clients = useClientStore((state) => state.clients);
  const clientsData = clients as unknown as ClientsResponse;
  const getClients = useClientStore((state) => state.getClients);

  useEffect(() => {
    getClients(0, searchTerm, selectedStatus);
  }, [getClients, searchTerm, selectedStatus]);

  const loadMoreClients = () => {
    if (page < (clientsData.pagination?.totalPages ?? 0) - 1) return;
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getClients(nextPage, searchTerm, selectedStatus, false);
      return nextPage;
    });
  };

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(0);
  }, []);

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          onSearchChange={handleSearchChange}
          setIsFilterVisible={() => setIsFilterVisible(!isFilterVisible)}
          filterStatuses={[
            { key: 'FRECUENT', label: 'Frecuente' },
            { key: 'POTENTIAL', label: 'Potencial' },
            { key: 'COMPETENCE', label: 'Competencia' },
          ]}
          isFilterVisible={isFilterVisible}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          showArrow={false}
        />
      ),
    });
  }, [navigator, isFilterVisible, selectedStatus, handleSearchChange]);

  const getVisitColor = (nextVisit: string | null): string | undefined => {
    if (!nextVisit) return undefined;

    const now = dayjs();
    const visitDate = dayjs(nextVisit);
    const diffInMonths = visitDate.diff(now, 'month', true);

    if (diffInMonths <= 1) {
      return 'red';
    } else if (diffInMonths <= 1.5) {
      return 'yellow';
    }

    return undefined;
  };

  const sortedClients = useMemo(() => {
    return clientsData?.result?.filter((client) => !client.isOneTime).sort((a, b) => a.name.localeCompare(b.name));
  }, [clientsData]);

  useFocusEffect(
    useCallback(() => {
      const pollingInterval = setInterval(() => {
        getClients(0, searchTerm, selectedStatus);
      }, 5000);

      return () => {
        clearInterval(pollingInterval);
      };
    }, [getClients, searchTerm, selectedStatus]),
  );

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.clients_container}>
        <Row alignItems="center" justifyContent="space-between" style={styles.client_tab_container}>
          <View style={styles.client_tab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
              Clientes
            </Text>
          </View>
          <Button shadow={false} onPress={() => router.push(ClientsRoutesLink.CLIENT)} leftIcon={<Add color={Colors.white} />}>
            Nuevo Cliente
          </Button>
        </Row>
        <FlatList
          data={sortedClients}
          keyExtractor={(item) => item.id}
          style={styles.flatlist}
          nestedScrollEnabled
          onEndReached={loadMoreClients}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => {
            const visitColor = getVisitColor(item.nextVisit);
            return (
              <Pressable
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: ClientsRoutesLink.CLIENT,
                    params: { name: item.name, itemId: item.id },
                  })
                }
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Row gap={10} justifyContent="space-between" alignItems="center">
                    {visitColor && <View style={styles.userPlaceholderContainer}>{visitColor && <Clock color={visitColor} />}</View>}
                    <Text textColor={Colors.black} fontSize={14} fontWeight={300}>
                      {item.name}
                    </Text>
                  </Row>
                  <ArrowRight color={Colors.DARK_GRAY} width={24} height={24} />
                </Flex>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    position: 'relative',
    flex: 1,
    paddingBottom: 120,
    backgroundColor: Colors.white,
    marginTop: 32,
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
});
