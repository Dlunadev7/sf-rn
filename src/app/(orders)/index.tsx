import React, { useCallback, useEffect } from 'react';
import { Button, Row, Text } from '@/components/commons';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/utils';
import { Shortcuts } from '@/components/commons/shortcuts/shortcuts.component';
import { Budget, Cart, Lightning, LightningOutlined } from '../../../assets/svg';
import { router, useFocusEffect } from 'expo-router';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import { useOrderStore } from '@/zustand/order/order.store';
import { formatOrderText } from '@/helpers/format-order.text.helper';
import { Order } from '@/services/product.services';
import { SalesRoutesLink } from '@/utils/routes/sales.routes';
import { useUserStore } from '@/zustand/user/user.store';

export default function Orders() {
  const { orders, directOrders, preOrders, fetchOrders, fetchDirectOrders, fetchPreOrders } = useOrderStore();

  const user = useUserStore((state) => state.user);

  console.log(user.id);

  useEffect(() => {
    fetchOrders(
      {
        page: 0,
        itemsPerPage: 10,
        order: 'ASC',
        isDirect: false,
      },
      '',
    );
    fetchDirectOrders(
      {
        page: 0,
        order: 'ASC',
        isDirect: true,
      },
      '',
    );
    fetchPreOrders(
      {
        itemsPerPage: 10,
        page: 0,
        order: Order.ASC,
        isPreOrder: true,
      },
      '',
    );
  }, [fetchDirectOrders, fetchOrders, fetchPreOrders]);

  const totalOfDirectOrders = directOrders.pagination.total;
  const totalOfOrders = orders.pagination.total;
  const totalOfBudgets = preOrders.pagination.total;

  useFocusEffect(
    useCallback(() => {
      const pollingInterval = setInterval(() => {
        fetchOrders(
          {
            page: 0,
            itemsPerPage: 10,
            order: 'ASC',
            isDirect: false,
          },
          '',
        );
        fetchDirectOrders(
          {
            page: 0,
            order: 'ASC',
            isDirect: true,
          },
          '',
        );
        fetchPreOrders(
          {
            itemsPerPage: 10,
            page: 0,
            order: Order.ASC,
            isPreOrder: true,
          },
          '',
        );
      }, 5000);

      return () => {
        clearInterval(pollingInterval);
      };
    }, [fetchDirectOrders, fetchOrders, fetchPreOrders]),
  );
  return (
    <View style={styles.wrapper}>
      <Row alignItems="center" justifyContent="space-between" style={styles.orders_header}>
        <View style={styles.orders_header_title}>
          <Text textColor={Colors.black} fontWeight={500} fontSize={16}>
            Ordenes de compra
          </Text>
        </View>
        <Button
          onPress={() =>
            router.push({
              pathname: SalesRoutesLink.SALES,
              params: { isDirect: 'true' },
            })
          }
          shadow={false}
          backgroundColor={Colors.RED}
          leftIcon={<Lightning color={Colors.white} />}
          size="lg"
        >
          Venta Directa
        </Button>
      </Row>
      <View style={styles.container}>
        <Shortcuts
          backgroundColor={Colors.RED}
          icon={Cart}
          onPress={() => router.push(OrdersRoutesLink.ORDERS_CLIENTS)}
          title="Órdenes de Clientes"
          total={formatOrderText(totalOfOrders, 'order')}
        />
        <Shortcuts
          backgroundColor={Colors.RED}
          icon={LightningOutlined}
          onPress={() => router.push(OrdersRoutesLink.DIRECT_SALE)}
          title="Órdenes de Ventas Directas"
          total={formatOrderText(totalOfDirectOrders, 'order')}
        />
        <Shortcuts
          backgroundColor={Colors.LIGHT_BLUE}
          icon={Budget}
          onPress={() => router.push(OrdersRoutesLink.ORDERS_BUDGET)}
          title="Presupuestos"
          total={formatOrderText(totalOfBudgets, 'budget')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    flex: 1,
    marginTop: 64,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingBottom: 164,
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
