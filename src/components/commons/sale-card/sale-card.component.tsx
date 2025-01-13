import React from 'react';
import { Pressable, TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Row } from '../layout/row/row.component';
import { Cross } from '../../../../assets/svg';
import { Colors } from '@/utils';
import { Flex } from '../layout/flex/flex.component';
import { Column } from '../layout/column/column.component';
import { Counter } from '../counter/counter.component';
import { Text } from '../text/text.component';

interface Detail {
  id: string;
  title: string;
  type: string;
  price: number;
}

interface DetailCardProps {
  detail: Detail;
  counters: { [key: string]: number };
  values: { discounts: { [key: string]: string } };
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
  handleBlur: (field: string) => void;
  handleChangeDiscount: (value: string, setFieldValue: DetailCardProps['setFieldValue'], detail: Detail) => void;
  handleCounterChange: (value: number, detail: Detail) => void;
  removeDetail: (title: string) => void;
}

const DetailCard: React.FC<DetailCardProps> = ({
  detail,
  counters,
  values,
  setFieldValue,
  handleBlur,
  handleChangeDiscount,
  handleCounterChange,
  removeDetail,
}) => {
  return (
    <Pressable style={styles.card}>
      <Row justifyContent="space-between" alignItems="center">
        <Text style={styles.cardTitle}>{detail.title}</Text>
        <Pressable onPress={() => removeDetail(detail.id)}>
          <Cross color={Colors.black} width={24} height={24} />
        </Pressable>
      </Row>

      <Flex direction="row" justifyContent="space-between" alignItems="center" style={styles.card_description}>
        <Column gap={4}>
          <Text fontSize={14} fontWeight={500} textColor={Colors.DARK_GRAY}>
            {detail?.type}
          </Text>
          <Text fontSize={20} fontWeight={600} textColor={Colors.DARK_GRAY}>
            ${detail?.price * (counters[detail.id] || 1)}
          </Text>
        </Column>
        <Column gap={8}>
          <Counter disableDecrement countValue={counters[detail.id] ?? 1} onChange={(value) => handleCounterChange(value, detail)} />
          <View style={styles.group}>
            <Row alignItems="center" gap={8}>
              <Text>-</Text>
              <RNTextInput
                placeholder="0"
                value={values.discounts[detail.id] ? String(values.discounts[detail.id]) : '0'}
                onBlur={() => handleBlur('percent')}
                onChangeText={(value) => handleChangeDiscount(value, setFieldValue, detail)}
                style={styles.custom_input}
                editable={true}
                keyboardType="number-pad"
              />
              <Text>%</Text>
            </Row>
          </View>
        </Column>
      </Flex>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 'auto',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
  },
  card_description: {
    marginTop: 8,
    // marginBottom: 24,
  },
  custom_input: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    textAlign: 'center',
  },
  group: {
    // width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GRAY,
  },
});

export default DetailCard;
