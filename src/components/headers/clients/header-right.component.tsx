import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, scaleSize } from '@/utils';
import { Column, Row, Text } from '@/components/commons';
import { Check, Filter } from '../../../../assets/svg';
import { useClientStore } from '@/zustand/client/client.store';
import { ClientStatus } from '@/utils/enum/status.enum';

export const HeaderRight = ({
  isFilterVisible,
  setIsFilterVisible,
}: {
  isFilterVisible: boolean;
  setIsFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const setFilterByStatus = useClientStore((state) => state.setFilterByStatus);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleFilter = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setFilterByStatus('');
    } else {
      // Selecciona el nuevo filtro
      setSelectedStatus(status);
      setFilterByStatus(status);
    }
    setIsFilterVisible(false);
  };

  return (
    <View style={styles.headerContainer}>
      <Row gap={12} alignItems="center">
        <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)}>
          <Filter color={Colors.black} width={32} height={32} />
        </TouchableOpacity>
      </Row>

      {isFilterVisible && (
        <Column gap={12} style={styles.filter_menu}>
          <TouchableOpacity onPress={() => handleFilter(ClientStatus.FRECUENT)} style={[styles.filterItem]}>
            <Row alignItems="center" justifyContent="space-between">
              <Text fontSize={14}>Frecuente</Text>
              {selectedStatus === ClientStatus.FRECUENT && <Check color={Colors.black} />}
            </Row>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleFilter(ClientStatus.POTENTIAL)} style={[styles.filterItem]}>
            <Row alignItems="center" justifyContent="space-between">
              <Text fontSize={14}>Potencial</Text>
              {selectedStatus === ClientStatus.POTENTIAL && <Check color={Colors.black} />}
            </Row>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleFilter(ClientStatus.UNSUBSCRIBED)} style={[styles.filterItem]}>
            <Row alignItems="center" justifyContent="space-between">
              <Text fontSize={14}>De baja</Text>
              {selectedStatus === ClientStatus.UNSUBSCRIBED && <Check color={Colors.black} />}
            </Row>
          </TouchableOpacity>
        </Column>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filter_menu: {
    width: scaleSize(220),
    height: 'auto',
    backgroundColor: Colors.white,
    borderRadius: 8,
    position: 'absolute',
    top: 48,
    right: 0,
    zIndex: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  filterItem: {
    paddingVertical: 10,
    borderRadius: 8,
  },
});
