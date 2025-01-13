import React, { useState, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Colors } from '@/utils';
import { Center } from '../layout/center/center.component';
import { Column } from '../layout/column/column.component';
import { Text } from '../text/text.component';
import { Button } from '../button/button.component';
import { Row } from '../layout/row/row.component';
import styles from './map.styles';
import { useUserStore } from '@/zustand/user/user.store';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_URL_MAP;
const MAPBOX_API_URL = process.env.EXPO_PUBLIC_MAPBOX_API_URL;

export const ModalAddress = ({
  showModal,
  setShowModal,
  onLocationSelect,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onLocationSelect: (location: { latitude: number; longitude: number }, address: string | null) => void;
}) => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const handleSelectLocation = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    setLoadingAddress(true);
    try {
      const response = await fetch(`${MAPBOX_API_URL}/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const placeName = data.features[0].text + ' ' + (data.features[0].address ?? '');
        setAddress(placeName || 'Dirección no encontrada');
      } else {
        setAddress('Dirección no encontrada');
      }
    } catch (error) {
      setAddress('Error al obtener dirección');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation, address);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setSelectedLocation(null);
    setAddress(null);
    setShowModal(false);
  };

  const mapRegion = useMemo(() => {
    return user?.location
      ? {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : undefined;
  }, [user?.location]);

  return (
    <View style={styles.container}>
      <Modal
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.9}
        onBackdropPress={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.mapContainer}>
            {user?.location ? (
              <MapView style={styles.map} initialRegion={mapRegion} onPress={handleSelectLocation}>
                <Marker title="Mi ubicación actual" coordinate={user.location} />
                {selectedLocation && <Marker title="Ubicación seleccionada" coordinate={selectedLocation} />}
              </MapView>
            ) : (
              <Center>
                <ActivityIndicator color={Colors.black} />
              </Center>
            )}
          </View>
          <Column style={styles.modal_information}>
            <View style={styles.addressContainer}>
              {loadingAddress ? <Text fontSize={14}>Obteniendo dirección...</Text> : <Text fontSize={14}>Dirección: {address}</Text>}
            </View>
            <Row gap={8}>
              <Button onPress={handleCancel} type="text">
                Cancelar
              </Button>
              <Button onPress={handleConfirm}>Aceptar</Button>
            </Row>
          </Column>
        </View>
      </Modal>
    </View>
  );
};
