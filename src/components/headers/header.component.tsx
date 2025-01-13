import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, scaleSize } from '@/utils';
import { Check, Cross, Filter, Search } from '../../../assets/svg';
import { Row, Text } from '../commons';
interface HeaderProps {
  isFilterVisible?: boolean;
  setIsFilterVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  onBackPress?: () => void;
  searchTerm?: string;
  onSearchChange?: (text: string) => void;
  setSearchTerm?: (text: string) => void;
  selectedStatus?: string | null;
  setSelectedStatus?: (state: string | null) => void;
  filterStatuses?: { key: string; label: string }[];
  showArrow?: boolean;
  rightIcon?: React.ReactNode;
  checkIcon?: React.ReactNode;
  custom?: React.ReactNode | React.ReactNode[];
  background?: string;
}

export const Header = (props: HeaderProps) => {
  const {
    isFilterVisible = false,
    setIsFilterVisible,
    title,
    onBackPress,
    searchTerm,
    onSearchChange,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    filterStatuses = [],
    showArrow = true,
    rightIcon,
    background,
    checkIcon,
    custom,
  } = props;

  const handleFilter = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus?.(null);
    } else {
      setSelectedStatus?.(status);
    }
    setIsFilterVisible?.(false);
  };

  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm || '');

  useEffect(() => {
    if (searchTerm !== internalSearchTerm) {
      setInternalSearchTerm(searchTerm || '');
    }
  }, [searchTerm]);

  const handleClearSearch = () => {
    setInternalSearchTerm('');
    if (setSearchTerm) {
      setSearchTerm('');
    }
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleSearchChange = (text: string) => {
    setInternalSearchTerm(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  return (
    <Row alignItems="center" style={[styles.headerContainer, { backgroundColor: background }]}>
      {title ? (
        <Row alignItems="center" justifyContent="space-between" style={[styles.header_content_container, custom ? { flex: 0.98 } : {}]}>
          <Row alignItems="center" gap={8}>
            {onBackPress && (
              <TouchableOpacity onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color={Colors.black} />
              </TouchableOpacity>
            )}
            <Text textColor={Colors.black} fontSize={16} fontWeight={500}>
              {title}
            </Text>
          </Row>

          {rightIcon}
        </Row>
      ) : (
        custom && (
          <Row alignItems="center" gap={8} style={[styles.header_content_container, custom ? { flex: 0.98 } : {}]}>
            {custom}
          </Row>
        )
      )}

      {onSearchChange && (
        <Row alignItems="center" gap={8}>
          {!title && showArrow && (
            <TouchableOpacity onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color={Colors.black} />
            </TouchableOpacity>
          )}
          <View
            style={[
              styles.input_container,
              showArrow && filterStatuses.length > 1 && checkIcon
                ? { flex: 0.8 }
                : filterStatuses.length > 0
                  ? { flex: 0.9 }
                  : (showArrow && filterStatuses.length > 1) || custom
                    ? { flex: 0.9 }
                    : showArrow
                      ? { flex: 1 }
                      : {},
            ]}
          >
            <Search color={Colors.GRAY} />
            <TextInput
              style={[
                styles.input,
                showArrow && filterStatuses.length > 0 && checkIcon
                  ? { width: '78%' }
                  : (showArrow && filterStatuses.length > 0) || custom
                    ? { width: '84%' }
                    : filterStatuses.length > 0
                      ? { width: '85%' }
                      : { width: '88%' },
              ]}
              placeholder="Buscar..."
              placeholderTextColor={Colors.DARK_GRAY}
              value={internalSearchTerm}
              onChangeText={handleSearchChange}
            />
            <Pressable onPress={handleClearSearch}>
              <Cross color={Colors.black} />
            </Pressable>
          </View>
        </Row>
      )}

      {setIsFilterVisible && (
        <Row alignItems="center" gap={8} style={{ width: 50 }}>
          <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)}>
            <Filter color={Colors.black} width={28} height={28} />
          </TouchableOpacity>
          {checkIcon}
        </Row>
      )}
      {custom && (
        <Row alignItems="center" gap={8}>
          {checkIcon}
        </Row>
      )}

      {isFilterVisible && (
        <View style={styles.filter_menu}>
          {filterStatuses.map(({ key, label }) => (
            <TouchableOpacity key={key} onPress={() => handleFilter(key)} style={styles.filterItem}>
              <Row alignItems="center" justifyContent="space-between">
                <Text fontSize={14}>{label}</Text>
                {selectedStatus === key && <Check color={Colors.black} />}
              </Row>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Row>
  );
};

const styles = StyleSheet.create({
  header_content_container: {
    width: '100%',
  },
  filter_menu: {
    width: scaleSize(220),
    height: 'auto',
    backgroundColor: Colors.white,
    borderRadius: 8,
    position: 'absolute',
    top: 100,
    right: 16,
    zIndex: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopRightRadius: 0,
  },
  headerContainer: {
    height: scaleSize(100),
    width: '100%',
    paddingTop: 48,
    paddingHorizontal: 12,
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    zIndex: 1,
  },
  filterItem: {
    paddingVertical: 10,
    borderRadius: 8,
  },
  input_container: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 100,
    height: scaleSize(32),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  input: {
    marginLeft: 12,
    width: '80%',
  },
});
