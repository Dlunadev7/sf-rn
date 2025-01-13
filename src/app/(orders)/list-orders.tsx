import { View, StyleSheet, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, scaleSize } from '@/utils';
import { router, useNavigation } from 'expo-router';
import { Header } from '@/components/headers';
import { Row, Flex, Text, Button, Checkbox } from '@/components/commons';
import { Sofocon, ArrowRight, Cart, Trash, CheckSquare } from '../../../assets/svg';
import { useOrderStore } from '@/zustand/order/order.store';
import { Order } from '@/services/product.services';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import { OrderResponse, OrderStatus } from '@/services/order.service';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import { truncateText } from '@/helpers/truncate-text.helper';
import { SalesRoutesLink } from '@/utils/routes/sales.routes';
import { Ionicons } from '@expo/vector-icons';

export default function ListOrders() {
  const navigator = useNavigation();
  const { orders, fetchOrders } = useOrderStore();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined | string | null>();
  const { updateOrder, deleteOrder } = useOrderStore();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((state: string | null) => {
    setSelectedStatus(state);
    setPage(0);
  }, []);

  const loadMoreProducts = () => {
    if (searchTerm.length > 0) return;
    if (page >= (orders.pagination?.totalPages ?? 0) - 1) return;

    const nextPage = page + 1;
    fetchOrders(
      {
        itemsPerPage: 10,
        page: nextPage,
        order: Order.ASC,
        status: selectedStatus,
      },
      searchTerm,
    );
    setPage(nextPage);
  };

  const orderStatusDictionary: { [key: string]: string } = {
    REQUEST: 'Solicitado',
    DELIVERED: 'Entregado',
    PREPARATION: 'En preparación',
    READY_PICKUP: 'Listo para retirar',
    EGRESS: 'Egreso',
  };

  const orderStatusListDictionary: { [key: string]: string } = {
    DELIVERED: 'Entregado',
    EGRESS: 'Egreso',
  };

  const orderStatus = Object.keys(orderStatusListDictionary).map((key) => ({
    name: orderStatusListDictionary[key],
    value: key,
  }));

  const handleChangeStatus = async (item: OrderResponse, newStatus: string) => {
    await updateOrder(item.id, {
      status: newStatus as OrderStatus,
    });

    setPage(0);

    await fetchOrders(
      {
        itemsPerPage: 10,
        page: page,
        order: Order.ASC,
        status: selectedStatus,
      },
      '',
    );
  };

  const handleSelectAll = useCallback(() => {
    setSelectAll((prev) => !prev);
    setSelectedOrders((prev) => (selectAll ? [] : orders.result.map((order) => order.id)));
  }, [selectAll, orders]);

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId],
    );
  };

  const handleDeleteOrders = useCallback(async () => {
    try {
      await Promise.all(
        selectedOrders.map(async (orderId) => {
          await deleteOrder(orderId);
        }),
      );

      setSelectedOrders([]);
      setSelectAll(false);

      const paginationParams = {
        itemsPerPage: 10,
        page: 0,
        order: Order.ASC,
        status: selectedStatus,
        reload: true,
      };

      await fetchOrders(paginationParams, searchTerm);
    } catch (error) {
      console.error('Error deleting orders:', error);
    }
  }, [deleteOrder, fetchOrders, selectedOrders, searchTerm, selectedStatus]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const initialPaginationParams = {
        itemsPerPage: 10,
        page: page,
        order: Order.ASC,
        status: selectedStatus,
      };

      await fetchOrders(initialPaginationParams, searchTerm);
      setLoading(false);
    };

    loadProducts();
  }, [searchTerm, fetchOrders, page, selectedStatus]);

  useEffect(() => {
    navigator.setOptions({
      header: () =>
        isEditableMode ? (
          <Header
            custom={
              <>
                <TouchableOpacity onPress={() => setIsEditableMode(false)}>
                  <Ionicons name="arrow-back" size={24} color={Colors.black} />
                </TouchableOpacity>
                <Row alignItems="center" justifyContent="flex-start" gap={8}>
                  <Text textColor={Colors.black}>Seleccionar todo</Text>
                  <Checkbox isChecked={selectAll} onPress={handleSelectAll} fillColor={Colors.SKY_BLUE} />
                </Row>
              </>
            }
            checkIcon={
              <Pressable
                onPress={() => {
                  handleDeleteOrders();
                }}
              >
                <Trash color={Colors.black} width={28} height={28} />
              </Pressable>
            }
          />
        ) : (
          <Header
            onBackPress={() => router.back()}
            showArrow
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            setIsFilterVisible={() => setIsFilterVisible(!isFilterVisible)}
            filterStatuses={[
              { key: 'REQUEST', label: 'Solicitado' },
              { key: 'DELIVERED', label: 'Entregado' },
              { key: 'PREPARATION', label: 'Preparacion' },
              { key: 'EGRESS', label: 'Egreso' },
              { key: 'READY_PICKUP', label: 'Para retiro' },
            ]}
            isFilterVisible={isFilterVisible}
            setSelectedStatus={handleFilterChange}
            selectedStatus={selectedStatus}
            checkIcon={
              isEditableMode ? (
                <Pressable onPress={() => setIsEditableMode(false)}>
                  <Trash color={Colors.black} width={32} height={32} />
                </Pressable>
              ) : (
                <Pressable onPress={() => setIsEditableMode(true)}>
                  <CheckSquare color={Colors.black} width={28} height={28} />
                </Pressable>
              )
            }
          />
        ),
    });
  }, [
    handleDeleteOrders,
    handleFilterChange,
    handleSearchChange,
    handleSelectAll,
    isEditableMode,
    isFilterVisible,
    navigator,
    searchTerm,
    selectAll,
    selectedStatus,
    setIsEditableMode,
  ]);

  const filteredOrders = orders.result.filter((order) => order.status === OrderStatus.REQUEST);
  return (
    <View style={styles.wrapper}>
      <View style={styles.productsContainer}>
        <Row style={styles.productTabContainer} gap={8} alignItems="center" justifyContent="space-around">
          <View style={styles.productTab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
              Ordénes de clientes
            </Text>
          </View>
          <Button
            shadow={false}
            onPress={() => router.push(SalesRoutesLink.SALES)}
            backgroundColor={Colors.RED}
            leftIcon={<Cart color={Colors.white} width={16} />}
          >
            Generar Venta
          </Button>
        </Row>
        <FlatList
          data={isEditableMode ? filteredOrders : orders.result}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          nestedScrollEnabled
          renderItem={({ item, index }) => {
            return (
              <Pressable
                onPress={() =>
                  isEditableMode
                    ? {}
                    : router.push({
                        pathname: OrdersRoutesLink.ORDERS_ID,
                        params: {
                          id: item.id,
                          name: item.client.name,
                        },
                      })
                }
                style={styles.item}
              >
                <Flex direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Row gap={8} alignItems="center" style={styles.row}>
                    {isEditableMode ? (
                      <Checkbox
                        isChecked={selectedOrders.includes(item.id)}
                        onPress={() => handleToggleOrder(item.id)}
                        fillColor={Colors.SKY_BLUE}
                        disabled={item.status !== OrderStatus.REQUEST}
                      />
                    ) : (
                      <Sofocon width={32} height={32} />
                    )}
                    <Text textColor={Colors.black} fontSize={14} fontWeight={400}>
                      {truncateText(item?.client?.name, 15)}
                    </Text>
                  </Row>

                  <Row style={styles.select} alignItems="center">
                    <CustomSelect
                      data={orderStatus}
                      label=""
                      loading={false}
                      onBlur={() => {}}
                      onChange={(newStatus) => handleChangeStatus(item, newStatus.value)}
                      placeholder=""
                      value={orderStatusDictionary[item.status] || ''}
                      showValue
                      canWrite={false}
                      backgroudDisabled={false}
                      editable={String(item.status) === String(OrderStatus.REQUEST) || String(item.status) === String(OrderStatus.EGRESS)}
                    />
                  </Row>
                  <Pressable style={styles.arrow}>
                    <ArrowRight color={Colors.DARK_GRAY} width={24} height={24} />
                  </Pressable>
                </Flex>
              </Pressable>
            );
          }}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (loading ? <ActivityIndicator color={Colors.black} /> : <></>)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 32,
  },
  item: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: scaleSize(20),
    backgroundColor: Colors.white,
    marginVertical: 4,
  },
  flatList: {
    flex: 1,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  productTab: {
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderStartEndRadius: 12,
    borderTopRightRadius: 12,
  },
  productTabContainer: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
  },
  headerRow: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  priceLabelRow: {
    marginRight: 55,
  },
  priceRow: {
    alignItems: 'center',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  row: {
    marginTop: 8,
    flex: 2,
  },
  arrow: {
    marginTop: 12,
  },
  select: {
    alignSelf: 'flex-start',
    width: 150,
  },
});

/**
 *
 */
