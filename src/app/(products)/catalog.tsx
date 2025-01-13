import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Flex, Row, Text } from '@/components/commons';
import { Colors, scaleSize } from '@/utils';
import { router, useNavigation } from 'expo-router';
import { ArrowRightLarge } from '../../../assets/svg';
import { ProductsRoutesLink } from '@/utils/routes/products.routes';
import { useCategoryStore } from '@/zustand/categories/categories.store';
import { API_URL_IMAGES } from '../../../config';
import { Header } from '@/components/headers';
import { staticImages } from '../../../assets/images';

export default function Catalog() {
  const { categories, fetchCategories, pagination } = useCategoryStore();
  const [page, setPage] = useState(1);
  const navigator = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(1);
  }, []);

  const loadCategories = useCallback(async () => {
    const paginationParams = {
      itemsPerPage: 10,
      page: page - 1,
      order: 'ASC',
    };

    await fetchCategories(paginationParams, searchTerm);
  }, [fetchCategories, searchTerm, page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadMoreCategories = useCallback(() => {
    if (page < pagination.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, pagination.totalPages]);

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          onSearchChange={handleSearchChange}
          onBackPress={() => {
            router.back();
            fetchCategories({
              page: 0,
              itemsPerPage: 10,
              order: 'ASC',
            });
          }}
          setSearchTerm={setSearchTerm}
        />
      ),
    });
  }, [navigator, handleSearchChange, fetchCategories]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadCategories();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadCategories]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.products_container}>
        <Row alignItems="center" justifyContent="space-between" style={styles.product_tab_container}>
          <View style={styles.product_tab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400}>
              Catálogo
            </Text>
          </View>
        </Row>
        <FlatList
          data={categories}
          style={styles.flatlist}
          nestedScrollEnabled
          numColumns={2}
          contentContainerStyle={styles.content_container}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: ProductsRoutesLink.PRODUCT,
                    params: { title: item.name, category: item.id },
                  })
                }
                key={item.id}
              >
                {item.picture ? (
                  <Image source={{ uri: `${API_URL_IMAGES}/${item.picture}` }} style={styles.item_image} />
                ) : (
                  <Image source={staticImages.EXTINTORES_MOCKUP} style={styles.item_image} />
                )}
                <Flex direction="column" justifyContent="space-between" style={styles.flexContainer}>
                  <Text fontSize={16} fontWeight={600} textColor={Colors.black} transform="capitalize" maxLength={16}>
                    {item.name}
                  </Text>
                  <Row justifyContent="space-between" style={styles.rowContainer}>
                    <Text underline textColor={Colors.DARK_GRAY} fontSize={14}>
                      Ver todo
                    </Text>
                    <ArrowRightLarge color={Colors.DARK_GRAY} />
                  </Row>
                </Flex>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreCategories}
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
    flex: 1,
    maxWidth: '48%',
    height: '100%',
    minHeight: scaleSize(203),
    backgroundColor: Colors.white,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item_image: {
    width: '100%',
    height: scaleSize(126),
    backgroundColor: Colors.LIGHT_GRAY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flatlist: {
    flex: 1,
  },
  content_container: {
    gap: 12,
    paddingBottom: 32,
  },
  products_container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  product_tab: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderStartEndRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'flex-start',
  },
  product_tab_container: {
    paddingRight: 12,
    backgroundColor: Colors.DEFAULT_BACKGROUND,
  },
  flexContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  rowContainer: {
    width: '100%',
  },
});
