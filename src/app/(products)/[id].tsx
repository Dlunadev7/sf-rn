import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Column, Container, KeyboardContainer, Text, TextInput } from '@/components/commons';
import { Image, Platform, View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '@/utils';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import useProductStore from '@/zustand/products/products.store';
import { staticImages } from '../../../assets/images';

export default function ProductInfo() {
  const { params } = useRoute<RouteProp<{ params: { name: string; itemId: string } }>>();
  const { itemId, name } = params;
  const { product, fetchProductById } = useProductStore();
  const platform = Platform.OS;

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      await fetchProductById(itemId);
    };

    loadProduct();
  }, [fetchProductById, itemId]);

  const mappedList = useMemo(() => {
    return product?.list
      ? Array.isArray(product.list)
        ? product.list
            .filter((listItem) => listItem.list?.name !== undefined)
            .map((listItem) => ({
              name: listItem.list?.name,
              id: listItem.id,
            }))
        : []
      : [];
  }, [product?.list]);

  const handleSelectChange = useCallback(
    (value: { name: string; id: string }) => {
      setSelectedOption(value.name);

      const selectedPrice = product?.list?.find((item) => item?.id === value.id)?.price;

      setPrice(selectedPrice ? String(selectedPrice) : '');
    },
    [product?.list],
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text fontSize={14} fontWeight={600}>
          {name}
        </Text>
      </View>
      <KeyboardContainer extraScrollHeight={32} keyboardShouldPersistTaps="handled">
        <Container paddingHorizontal={12} paddingVertical={platform === 'ios' ? 12 : 24} gap={24} style={styles.content_container}>
          <Image source={staticImages.EXTINTOR_MOCKUP} style={styles.image} resizeMode="cover" />
          <Column gap={12}>
            <TextInput label="Nombre" editable={false} defaultValue={params.name} />
            <TextInput label="Descripción" editable={false} defaultValue={product?.description} />
            <TextInput label="Stock" editable={false} defaultValue={String(product?.stock) || ''} />
            <CustomSelect
              label="Precio por unidad"
              data={mappedList || []}
              placeholder="Seleccionar lista de precios"
              loading={false}
              onBlur={() => {}}
              onChange={handleSelectChange}
              value={selectedOption}
              canWrite={false}
              backgroudDisabled={false}
              showValue
            />
            <TextInput editable={false} defaultValue={`$${price}`} />

            <TextInput label="Categoría" editable={false} defaultValue={name} />
          </Column>
        </Container>
      </KeyboardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    flex: 1,
  },
  content_container: {
    paddingBottom: 32,
  },
  titleContainer: {
    backgroundColor: Colors.white,
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    borderTopRightRadius: 12,
  },
  image: {
    marginHorizontal: 'auto',
    marginTop: 24,
  },
  flexInput: {
    flex: 1,
  },
});
