import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Flex } from '../layout/flex/flex.component';
import { Text } from '../text/text.component';
import { ArrowRight } from '../../../../assets/svg';
import { Colors } from '@/utils';
import { ProductsRoutesLink } from '@/utils/routes/products.routes';

export const ListPrices = ({ item }: { item: { name: string; id: string } }) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: ProductsRoutesLink.PRODUCT_LIST,
          params: {
            id: item.id,
            title: item.name,
          },
        })
      }
    >
      <Flex justifyContent="space-between" alignItems="center" style={styles.list_prices_item}>
        <Text fontSize={16}>{item.name}</Text>
        <ArrowRight color={Colors.DARK_GRAY} width={24} height={24} />
      </Flex>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  list_prices_item: {
    paddingVertical: 24,
    backgroundColor: Colors.white,
  },
});
