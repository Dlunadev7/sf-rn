import React, { useEffect } from 'react';
import { Row, Text } from '@/components/commons';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/utils';
import { Shortcuts } from '@/components/commons/shortcuts/shortcuts.component';
import ProductIcon from '../../../assets/svg/products.svg';
import { Orders } from '../../../assets/svg';
import { router } from 'expo-router';
import { ProductsRoutesLink } from '@/utils/routes/products.routes';
import useProductStore from '@/zustand/products/products.store';
import { Order, PaginationParams } from '@/services/product.services';
import { useCategoryStore } from '@/zustand/categories/categories.store';

export default function Products() {
  const { fetchAllList, pagination } = useProductStore();
  const { fetchCategories, pagination: CategoryPagination } = useCategoryStore();

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: 0,
      itemsPerPage: 10,
      order: Order.ASC,
      category: '',
    };

    (async () =>
      await fetchAllList({
        page: 0,
        itemsPerPage: 10,
        order: Order.DESC,
        category: '',
      }))();
    (async () => await fetchCategories(paginationParams))();
  }, [fetchAllList, fetchCategories]);

  return (
    <View style={styles.wrapper}>
      <Row alignItems="center" justifyContent="space-between" style={styles.orders_header}>
        <View style={styles.orders_header_title}>
          <Text textColor={Colors.black} fontWeight={500} fontSize={16}>
            Productos
          </Text>
        </View>
      </Row>
      <View style={styles.container}>
        <Shortcuts
          backgroundColor={Colors.RED}
          icon={ProductIcon}
          title="Catálogo"
          total={`${CategoryPagination.total ?? 0} categorias`}
          onPress={() => router.push(ProductsRoutesLink.CATALOG)}
        />
        <Shortcuts
          backgroundColor={Colors.LIGHT_BLUE}
          icon={Orders}
          title="Listas de precios"
          total={`${pagination?.lists.total ?? 0} listas`}
          onPress={() => router.push(ProductsRoutesLink.LIST)}
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
