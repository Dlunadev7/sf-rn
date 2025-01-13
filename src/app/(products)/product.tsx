import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Flex, Row, Text } from '@/components/commons';
import { Colors, scaleSize } from '@/utils';
import { useNavigation, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { ProductsRoutesLink } from '@/utils/routes/products.routes';
import useProductStore from '@/zustand/products/products.store';
import { Order } from '@/services/product.services';
import { ArrowRight, Sofocon } from '../../../assets/svg';
import { Header } from '@/components/headers';

export default function Product() {
  const { category, title } = useRoute().params as { category: string; title: string };
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Record<string, { name: string; id: string; selectedOption: string }>>({});
  const navigator = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const { products, pagination, fetchProducts } = useProductStore((state) => ({
    products: state.products,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    fetchProducts: state.fetchProducts,
  }));

  const handlePress = useCallback(
    (itemName: string, itemId: string) => {
      const selectedOption = selectedItems[itemName]?.selectedOption || '';

      setSelectedItems((prevState) => ({
        ...prevState,
        [itemName]: { name: itemName, id: itemId, selectedOption: selectedOption },
      }));

      router.push({
        pathname: ProductsRoutesLink.PRODUCT_INFO,
        params: {
          name: itemName,
          itemId: itemId,
        },
      });
    },
    [selectedItems, router],
  );

  const loadProducts = useCallback(async () => {
    const paginationParams = {
      itemsPerPage: 10,
      page: page,
      category: category,
      order: Order.ASC,
    };

    await fetchProducts(paginationParams, searchTerm, false);
  }, [page, category, searchTerm, fetchProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const loadMoreProducts = useCallback(() => {
    if (pagination && page < pagination.product.totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [pagination, page]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(1);
  }, []);

  useEffect(() => {
    navigator.setOptions({
      header: () => <Header onSearchChange={handleSearchChange} onBackPress={() => router.back()} />,
    });
  }, [navigator, handleSearchChange, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadProducts();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadProducts]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.productsContainer}>
        <Row style={styles.productTabContainer}>
          <View style={styles.productTab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
              {title}
            </Text>
          </View>
        </Row>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          nestedScrollEnabled
          renderItem={({ item, index }) => {
            return (
              <Flex style={styles.item} direction="row" alignItems="center" justifyContent="space-between">
                <Pressable onPress={() => handlePress(item.name, item.id)} style={styles.row}>
                  <Row gap={8} alignItems="center">
                    <Sofocon width={32} height={32} />
                    <Text textColor={Colors.black} fontSize={14} fontWeight={400}>
                      {item.name}
                    </Text>
                  </Row>
                </Pressable>

                <Pressable>
                  <ArrowRight color={Colors.DARK_GRAY} width={24} height={24} />
                </Pressable>
              </Flex>
            );
          }}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.2}
        />
      </View>
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
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderStartEndRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'flex-start',
  },
  productTabContainer: {
    paddingRight: 12,
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
    flex: 2,
  },
});
