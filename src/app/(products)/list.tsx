import React, { useCallback, useEffect, useState } from 'react';
import { Row, Text } from '@/components/commons';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/utils';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { router, useNavigation } from 'expo-router';
import useProductStore from '@/zustand/products/products.store';
import { Order, PaginationParams } from '@/services/product.services';
import { Header } from '@/components/headers';
import { ListPrices } from '@/components/commons/list-price/list-price.component';

export default function List() {
  const navigator = useNavigation();
  const { lists, fetchAllList, pagination } = useProductStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setCurrentPage(0);
  }, []);

  const loadMoreData = useCallback(async () => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: 10,
      order: Order.DESC,
      category: '',
    };

    await fetchAllList(paginationParams, searchTerm.toLocaleLowerCase());
  }, [currentPage, fetchAllList, searchTerm]);

  useEffect(() => {
    loadMoreData();
  }, [currentPage, fetchAllList, loadMoreData, searchTerm]);

  const loadMoreCategories = () => {
    if (currentPage + 1 < (pagination?.lists.totalPages ?? 1)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadMoreData();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [searchTerm, currentPage, loadMoreData]);

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          onSearchChange={handleSearchChange}
          onBackPress={() => {
            router.back();
            fetchAllList({
              page: 0,
              itemsPerPage: 10,
              order: Order.DESC,
              category: '',
            });
          }}
          setSearchTerm={setSearchTerm}
        />
      ),
    });
  }, [navigator, handleSearchChange, fetchAllList]);

  return (
    <View style={styles.wrapper}>
      <Row alignItems="center" justifyContent="space-between" style={styles.orders_header}>
        <View style={styles.orders_header_title}>
          <Text textColor={Colors.black} fontWeight={500} fontSize={16}>
            Listas
          </Text>
        </View>
      </Row>
      <ScrollView style={styles.container} nestedScrollEnabled>
        <FlatList
          data={lists}
          renderItem={ListPrices}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreCategories}
          onEndReachedThreshold={0.1}
          nestedScrollEnabled
          style={styles.flatList}
        />
      </ScrollView>
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
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  orders_header: {
    marginRight: 12,
  },
  orders_header_title: {
    alignSelf: 'flex-start',
    paddingHorizontal: 48,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  list_prices_item: {
    paddingVertical: 24,
    backgroundColor: Colors.white,
  },
  flatList: {
    marginBottom: 24,
  },
});
