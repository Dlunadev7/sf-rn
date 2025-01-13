import React, { useEffect, useMemo, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  DimensionValue,
  View,
} from 'react-native';
import { Text } from '../text/text.component';
import { Colors } from '@/utils';
import { TextInput } from '../input/input.component';
import { Center } from '../layout/center/center.component';
import { FlatList } from 'react-native-gesture-handler';
import { ArrowDown } from '../../../../assets/svg';
import { Column } from '../layout/column/column.component';

type onChangeProps = {
  name: string;
  id: string;
  value: string;
  list?: {
    price: number;
  }[];
  type?: string;
};

interface SelectProps {
  label: string;
  placeholder: string;
  editable?: boolean;
  value: string;
  onChange: (value: onChangeProps) => void;
  data:
    | {
        name?: string;
      }[]
    | [];
  canWrite?: boolean;
  error?: string;
  loading: boolean;
  onBlur: () => void;
  onFocus?: () => void;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  backgroudDisabled?: boolean;
  icon?: boolean;
  showValue?: boolean;
  arrowSize?: number;
  onLoadMore?: () => void;
  arrowColor?: string;
  selectsContainerWidth?: DimensionValue;
  flex?: number;
  emptyText?: string;
}

export const CustomSelect: React.FC<SelectProps> = ({
  label,
  placeholder,
  editable = true,
  value,
  onChange,
  data,
  canWrite = true,
  error,
  style,
  loading,
  onBlur,
  onFocus,
  leftIcon,
  icon = true,
  backgroudDisabled,
  showValue,
  arrowSize,
  onLoadMore,
  containerStyle,
  arrowColor = Colors.GRAY,
  selectsContainerWidth = '100%',
  flex = 1,
  emptyText,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [, setIsFocus] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const toggleListVisibility = () => {
    setIsListVisible((prev) => !prev);
  };

  const handleItemSelect = (item: { name: string }) => {
    setSelectedItem(item.name); // Guardar el seleccionado
    setQuery(''); // Limpiar la búsqueda
    setIsListVisible(false); // Ocultar la lista
    onChange(item as onChangeProps); // Notificar el cambio
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemName = 'name' in item ? item.name : '';
      return query.length === 0 || itemName?.toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query]);

  const currentValue = useMemo(() => {
    if (!showValue) {
      return query;
    }
    return selectedItem || query || placeholder;
  }, [showValue, query, selectedItem, placeholder]);

  useEffect(() => {
    if (value) {
      setSelectedItem(value);
    }
  }, [value]);

  useEffect(() => {
    if (query) {
      setSelectedItem('');
    }
  }, [query]);

  return (
    <Pressable onPress={toggleListVisibility} style={{ flex: flex }}>
      <Column style={[styles.custom_select]}>
        <TextInput
          label={label}
          placeholder={placeholder}
          value={selectedItem || currentValue}
          onChangeText={(text) => {
            setQuery(text);
          }}
          onPress={toggleListVisibility}
          icon={
            icon && (
              <Pressable onPress={toggleListVisibility}>
                <ArrowDown color={arrowColor} width={arrowSize ? arrowSize : 24} />
              </Pressable>
            )
          }
          editable={editable && canWrite}
          onBlur={onBlur}
          onFocus={() => {
            setIsFocus(true);
            if (onFocus) {
              onFocus();
            }
          }}
          error={error}
          style={style}
          leftIcon={leftIcon}
          backgroudDisabled={backgroudDisabled}
          styleContainer={containerStyle}
        />
        {isListVisible &&
          editable &&
          (loading ? (
            <Center style={styles.item_container}>
              <ActivityIndicator color={Colors.black} />
            </Center>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => String(index)}
              indicatorStyle="black"
              style={[styles.item_container, { width: selectsContainerWidth }]}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.name} style={styles.item} onPress={() => handleItemSelect(item as onChangeProps)}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text fontSize={12}>{emptyText}</Text>
                </View>
              }
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.5}
              nestedScrollEnabled
            />
          ))}
      </Column>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  custom_select: {
    zIndex: 999,
  },
  item_container: {
    minHeight: 'auto',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 14,
  },
  empty: {
    padding: 8,
  },
});
