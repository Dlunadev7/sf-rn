import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, CustomModal, Flex, Row, Text } from '@/components/commons';
import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/utils';
import { FlatList } from 'react-native-gesture-handler';
import { ArrowRight, CheckSquare, Download, Trash } from '../../../assets/svg';
import { router, useNavigation } from 'expo-router';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import { Header } from '@/components/headers';
import { useOrderStore } from '@/zustand/order/order.store';
import { OrderStatus } from '@/services/order.service';
import { Order } from '@/services/product.services';
import { Ionicons } from '@expo/vector-icons';
import { truncateText } from '@/helpers/truncate-text.helper';
import { API_URL } from '../../../config';
import useFileDownloader from '@/hooks/commons/use-download-pdf.hook';

export default function Budget() {
  const navigator = useNavigation();
  const { preOrders, fetchPreOrders, deleteOrder } = useOrderStore();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined | string | null>();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(0);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});

  const { statusMessage, downloadFromAPI } = useFileDownloader();

  const handleDownload = async (budgetName: string, budgetID: string, extension: string) => {
    setDownloadingStates((prev) => ({ ...prev, [budgetID]: true }));

    const pdfUrl = `${API_URL}/orders/pdf/${budgetID}`;
    const fileName = budgetName;
    console.log(pdfUrl);
    await downloadFromAPI(pdfUrl, fileName, extension);
    setShowModal(true);
    setDownloadingStates((prev) => ({ ...prev, [budgetID]: false }));
  };

  const loadMoreProducts = () => {
    if (preOrders && page < preOrders.pagination.totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSelectAll = useCallback(() => {
    setSelectAll((prev) => !prev);
    setSelectedOrders((prev) => (selectAll ? [] : preOrders.result?.map((order) => order.id)));
  }, [selectAll, preOrders]);

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId],
    );
  };

  const handleDeleteOrders = useCallback(async () => {
    try {
      await Promise.all(
        selectedOrders?.map(async (orderId) => {
          await deleteOrder(orderId);
        }),
      );

      setSelectedOrders([]);
      setSelectAll(false);

      const initialPaginationParams = {
        itemsPerPage: 10,
        page: 0,
        order: Order.ASC,
        status: selectedStatus,
        isPreOrder: true,
      };

      await fetchPreOrders(initialPaginationParams, searchTerm);
    } catch (error) {
      console.error('Error deleting orders:', error);
    }
  }, [deleteOrder, fetchPreOrders, selectedOrders, searchTerm, selectedStatus]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const initialPaginationParams = {
        itemsPerPage: 10,
        page: 0,
        order: Order.ASC,
        status: selectedStatus,
        isPreOrder: true,
      };

      await fetchPreOrders(initialPaginationParams, searchTerm);
      setLoading(false);
    };

    loadProducts();
  }, [searchTerm, fetchPreOrders, page, selectedStatus]);

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
            onBackPress={() => setIsEditableMode(false)}
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
            // setIsFilterVisible={() => setIsFilterVisible(!isFilterVisible)}
            // filterStatuses={[
            //   { key: 'REQUEST', label: 'Solicitado' },
            //   { key: 'DELIVERED', label: 'Entregado' },
            //   { key: 'PREPARATION', label: 'Preparacion' },
            //   { key: 'EGRESS', label: 'Egreso' },
            //   { key: 'READY_PICKUP', label: 'Para retiro' },
            // ]}
            // isFilterVisible={isFilterVisible}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            custom={true}
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
    handleSearchChange,
    handleSelectAll,
    isEditableMode,
    navigator,
    searchTerm,
    selectAll,
    selectedStatus,
    setIsEditableMode,
  ]);

  return (
    <View style={styles.wrapper}>
      <Row alignItems="center" justifyContent="space-between" style={styles.orders_header}>
        <View style={styles.orders_header_title}>
          <Text textColor={Colors.black} fontWeight={500} fontSize={16}>
            Presupuestos
          </Text>
        </View>
        <Button onPress={() => router.push(OrdersRoutesLink.ORDERS_BUDGET_ID)} shadow={false} backgroundColor={Colors.LIGHT_BLUE} size="lg">
          Generar Presupuesto
        </Button>
      </Row>
      <View style={styles.container}>
        <FlatList
          data={preOrders.result}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: OrdersRoutesLink.ORDERS_BUDGET_ID,
                  params: { name: item.client.name, budgetId: item.id },
                })
              }
            >
              <Flex justifyContent="space-between" alignItems="center" style={styles.budgets_item}>
                {isEditableMode ? (
                  <Checkbox
                    isChecked={selectedOrders.includes(item.id)}
                    onPress={() => handleToggleOrder(item.id)}
                    fillColor={Colors.SKY_BLUE}
                  />
                ) : (
                  <></>
                )}
                <Text fontSize={16}>{truncateText(item.client.name, 15)}</Text>
                <Row alignItems="center" gap={8}>
                  <Button
                    onPress={() => handleDownload(item.client.name.toLocaleLowerCase().replace(' ', '-'), item.id, '.pdf')}
                    leftIcon={!downloadingStates[item.id] && <Download />}
                    shadow={false}
                    radius={6}
                    backgroundColor="transparent"
                    borderColor={Colors.DARK_GRAY}
                    type="outlined"
                    loading={false}
                  >
                    {downloadingStates[item.id] ? <ActivityIndicator color={Colors.black} /> : 'Descargar'}
                  </Button>
                  <ArrowRight color={Colors.DARK_GRAY} />
                </Row>
              </Flex>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() => (page !== 0 && loading ? <ActivityIndicator color={Colors.black} /> : <></>)}
        />
      </View>
      <CustomModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title={statusMessage.includes('error') ? 'Hubo un error' : 'Documento descargado con exito!'}
        content={
          <Text>
            {statusMessage.includes('error')
              ? 'Hubo un error al intentar descargar el archivo. Por favor, inténtalo de nuevo más tarde.'
              : '¡Todo listo! El archivo ha sido descargado exitosamente.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    flex: 1,
    marginTop: 32,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  orders_header: {
    marginRight: 12,
  },
  orders_header_title: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  budgets_item: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
});
