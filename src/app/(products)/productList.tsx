import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Column, Flex, Row, Text, TextInput } from '@/components/commons';
import { Colors, scaleSize } from '@/utils';
import { useRoute } from '@react-navigation/native';
import useProductStore from '@/zustand/products/products.store';
import { Order } from '@/services/product.services';
import { API_URL_IMAGES } from '../../../config';
import { Sofocon } from '../../../assets/svg';
import { router, useNavigation } from 'expo-router';
import { Header } from '@/components/headers';

export default function ProductList() {
  const params = useRoute().params as { id: string; title: string };
  const { products, pagination, fetchProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigator = useNavigation();
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    const paginationParams = {
      page: 0,
      itemsPerPage,
      order: Order.ASC,
      category: '',
      list: params.id,
    };
    fetchProducts(paginationParams, searchText, false);
  }, [currentPage, fetchProducts, params.id, searchText]);

  const loadMoreData = () => {
    if (currentPage < (pagination?.product.totalPages ?? 0)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          showArrow
          onSearchChange={handleSearchChange}
          searchTerm={searchText}
          setSearchTerm={setSearchText}
          onBackPress={() => router.back()}
        />
      ),
    });
  }, [handleSearchChange, navigator, searchText]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.productsContainer}>
        <Column>
          <Row style={styles.productTabContainer}>
            <View style={styles.productTab}>
              <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
                {params.title}
              </Text>
            </View>
          </Row>
        </Column>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <Flex style={styles.item} direction="row" alignItems="center" justifyContent="space-between">
              <Row gap={8} alignItems="center" style={styles.row}>
                {item.picture ? (
                  <Image source={{ uri: `${API_URL_IMAGES}/${item.picture}` }} width={32} height={32} style={styles.image} />
                ) : (
                  <Sofocon width={32} height={32} />
                )}
                <Text textColor={Colors.black} fontSize={14} fontWeight={400}>
                  {item.name}
                </Text>
              </Row>
              <TextInput value={`$ ${item?.list[0]?.price}`} editable={false} container={styles.flex_1} />
            </Flex>
          )}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
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
    flex: 3,
  },
  image: {
    borderRadius: 100,
  },
  flex_1: {
    flex: 1,
  },
});
