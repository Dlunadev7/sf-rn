import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomSheet, Column, CustomModal, Flex, Row, Text, TextInput, Wrapper } from '@/components/commons';
import { Colors } from '@/utils';
import { ArrowRight, Location, Phone, TraceRoute, UserOutlined } from '../../../assets/svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import MapView, { Callout, MapMarker, Marker, Polyline } from 'react-native-maps';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { RouteStatus } from '@/utils/enum/status.enum';
import { useGetDirection } from '@/hooks/api/get-direction.hook';
import { useUserStore } from '@/zustand/user/user.store';
import styles from '@/styles/routes/route.style';
import { Header } from '@/components/headers';
import { router, useNavigation } from 'expo-router';
import { useClientStore } from '@/zustand/client/client.store';
import { ClientResponse, ClientsResponse } from '@/utils/routes/routes.clients.service';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import { useRouteStore } from '@/zustand/routes/routes.store';
import { truncateText } from '@/helpers/truncate-text.helper';
import { staticImages } from '../../../assets/images';
import { useSocket } from '@/hooks/api/use-socket.hook';

type LocationType = {
  id: string;
  latitude: number;
  longitude: number;
};

const CustomCallout = ({ name, color }: { name: string; color: string }) => (
  <Callout tooltip>
    <View style={[styles.callout, { backgroundColor: color }]}>
      <Text textColor={Colors.white} textAlign="center" fontWeight={600}>
        {name}
      </Text>
    </View>
    <View style={[styles.arrow_callout, { borderTopColor: color }]} />
  </Callout>
);

export default function Route() {
  const markersRef = useRef<Record<string, MapMarker | null>>({});
  const mapRef = useRef<MapView>(null);
  const socket = useSocket();
  const { params } = useRoute<RouteProp<{ params: { title: string; routeID: string } }>>();
  const { directions, getDirections } = useGetDirection();
  const { user } = useUserStore();
  const { getClientsInRoute, clientsInRoute } = useClientStore();
  const { updateRoute } = useRouteStore();
  const navigator = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState<ClientResponse>();
  const [seeClientInfo, setSeeClientInfo] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RouteStatus | undefined | string | null>();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  const [statusValue, setStatusValue] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStatusPending, setSelectedStatusPending] = useState<{ name: string; value: string }>();
  const [currentItemId, setCurrentItemId] = useState<string>('');

  const clientsData = clientsInRoute as unknown as ClientsResponse;
  const clientInfo = tooltipInfo as unknown as ClientResponse;
  const location = user?.location;

  const [statuses, setStatuses] = useState<Record<string, RouteStatus>>({});

  const initialLocation = {
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    longitudeDelta: 0.0922,
    latitudeDelta: 0.0421,
  };

  const sortClientsByStatus = (clients: ClientResponse[]) => {
    const statusOrder = ['NEXT_VISIT', 'AVAILABLE', 'PENDING', 'VISITED'];

    return clients?.sort((a, b) => {
      const statusA =
        statusOrder.indexOf(a.clientInRoute[0].status) !== -1 ? statusOrder.indexOf(a.clientInRoute[0].status) : statusOrder.length;
      const statusB =
        statusOrder.indexOf(b.clientInRoute[0].status) !== -1 ? statusOrder.indexOf(b.clientInRoute[0].status) : statusOrder.length;
      return statusA - statusB;
    });
  };
  const sortedClients = sortClientsByStatus(clientsData.result);

  const centerMapOnInitialLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: initialLocation,
          zoom: 17,
          pitch: 0,
          heading: 0,
        },
        { duration: 1000 },
      );
    }
  };

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setPage(0);
  }, []);

  const toggleBottomSheet = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkerPress = (location: LocationType) => {
    const info = clientsData.result.find((info) => info.id === location.id);
    if (info) {
      setTooltipInfo(info);
      setSeeClientInfo(true);
    }
    getDirections(location);
  };

  const handleListItemPress = (item: ClientResponse) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }

    setTooltipInfo(item);
    setSeeClientInfo(true);
    getDirections({
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
    });
    const marker = markersRef.current[item.id];
    if (marker) {
      marker.showCallout();
    }

    setIsOpen(false);
  };

  const handleStatusUpdate = async (
    itemId: string,
    currentStatus: RouteStatus,
    selected: { name: string; value: string },
    setStatuses: React.Dispatch<React.SetStateAction<Record<string, RouteStatus>>>,
  ) => {
    const newStatus = Object.entries(routeStatusDictionary).find(([, label]) => label === selected.name)?.[0] as RouteStatus | undefined;

    if (newStatus) {
      setStatuses((prevStatuses) => {
        const updatedStatuses = { ...prevStatuses };
        updatedStatuses[itemId] = newStatus;
        return updatedStatuses;
      });

      await updateRoute(itemId, params.routeID, newStatus);
      await getClientsInRoute(params.routeID!, page, searchTerm, selectedStatus);
    }
  };

  const routeStatusDictionary = {
    [RouteStatus.AVAILABLE]: 'Libre',
    [RouteStatus.NEXT_VISIT]: 'Próxima visita',
    [RouteStatus.PENDING]: 'Pendiente',
    [RouteStatus.VISITED]: 'Visitado',
  };

  const statusColors: Record<RouteStatus, string> = {
    AVAILABLE: Colors.GRAY,
    NEXT_VISIT: Colors.SKY_BLUE,
    PENDING: Colors.RED,
    VISITED: Colors.GREEN,
  };

  const transformRouteStatus = (status: RouteStatus) => ({
    key: status,
    label: routeStatusDictionary[status] || 'Desconocido',
  });

  const transformedData = Object.values(RouteStatus).map(transformRouteStatus);
  const customSelectData = transformedData?.map((item) => ({
    name: item.label,
    value: item.key,
  }));

  useEffect(() => {
    navigator.setOptions({
      header: () =>
        seeClientInfo ? (
          <Header
            title={clientInfo.name}
            showArrow={true}
            onBackPress={() => {
              setSeeClientInfo(false);
              setIsOpen(true);
            }}
          />
        ) : (
          <Header
            onSearchChange={handleSearchChange}
            setIsFilterVisible={() => setIsFilterVisible(!isFilterVisible)}
            filterStatuses={transformedData}
            isFilterVisible={isFilterVisible}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            searchTerm={searchTerm}
            showArrow={true}
            onBackPress={() => router.back()}
          />
        ),
    });
  }, [navigator, isFilterVisible, selectedStatus, handleSearchChange, searchTerm, transformedData, seeClientInfo, clientInfo?.name]);

  useEffect(() => {
    getClientsInRoute(params.routeID!, page, searchTerm, selectedStatus);
  }, [getClientsInRoute, page, searchTerm, selectedStatus, params.routeID]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClientsInRoute(params.routeID!, page, searchTerm, selectedStatus);
      const clientsData = data as unknown as ClientsResponse;
      const newStatuses = clientsData.result.reduce(
        (acc, item) => {
          acc[item.id] = item.clientInRoute[0].status;
          return acc;
        },
        {} as Record<string, RouteStatus>,
      );
      setStatuses(newStatuses);
    };

    fetchData();

    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [getClientsInRoute, params.routeID, page, searchTerm, selectedStatus]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      `change-status-${params.routeID}`,
      ({ data, user }: { data: { id: string; status: RouteStatus; updateBy: { id: string } }; user: { email: string; id: string } }) => {
        setStatuses((prevStatuses) => {
          const updatedStatuses = { ...prevStatuses };
          updatedStatuses[data.id] = data.status;
          return updatedStatuses;
        });
        console.log(data);
      },
    );

    return () => {
      socket.off(`change-status-${params.routeID}`);
    };
  }, [params.routeID, socket]);

  useEffect(() => {
    return () => {
      markersRef.current = {};
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Wrapper>
        <Row alignItems="center" justifyContent="space-between" style={styles.client_tab_container}>
          <View style={styles.client_tab}>
            <Text textColor={Colors.black} fontSize={16} fontWeight={400} transform="capitalize">
              {params.title}
            </Text>
          </View>
        </Row>
        <View style={styles.container}>
          <MapView ref={mapRef} style={styles.map} initialRegion={initialLocation}>
            <Marker coordinate={initialLocation} pinColor={Colors.SKY_BLUE} image={staticImages.USER_MARKER} />

            {clientsData?.result?.map((item) => (
              <Marker
                key={item.id}
                ref={(ref) => {
                  markersRef.current[item.id] = ref;
                }}
                coordinate={{
                  latitude: Number(item.latitude),
                  longitude: Number(item.longitude),
                }}
                onPress={() => {
                  handleMarkerPress({
                    id: item.id,
                    latitude: Number(item.latitude),
                    longitude: Number(item.longitude),
                  });
                }}
              >
                <CustomCallout
                  name={tooltipInfo?.id === item.id ? tooltipInfo?.name : item?.name}
                  color={statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status]}
                />
              </Marker>
            ))}

            {directions && directions.length > 0 && <Polyline coordinates={directions} strokeColor={Colors.blue} strokeWidth={6} />}
          </MapView>
          <Row style={styles.float_buttons} gap={8}>
            <Pressable style={styles.locateButton} onPress={centerMapOnInitialLocation}>
              <TraceRoute />
            </Pressable>
          </Row>
        </View>
        <View style={styles.toggleButtonContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleBottomSheet}>
            <Text fontWeight={600}>Clientes</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
      {isOpen && (
        <BottomSheet
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Clientes"
          content={
            <View style={styles.bottomSheet_container}>
              <BottomSheetFlatList
                data={sortedClients}
                style={styles.bottomSheet_content_container}
                nestedScrollEnabled={true}
                renderItem={({ item }) => {
                  return (
                    <>
                      <TouchableOpacity style={styles.item} onPress={() => handleListItemPress(item)}>
                        <Flex alignItems="flex-start" justifyContent="space-between">
                          <Text textColor={Colors.black} fontSize={14} fontWeight={300} style={styles.item_text}>
                            {item?.name}
                          </Text>
                          <Row alignItems="flex-start" style={{ zIndex: 999, width: 150 }}>
                            <CustomSelect
                              data={customSelectData}
                              value={truncateText(routeStatusDictionary[statuses[item.id]], 10)}
                              label=""
                              loading={false}
                              onBlur={() => {}}
                              onChange={(selected) => {
                                if (selected.value === RouteStatus.VISITED) {
                                  setSelectedStatusPending(selected);
                                  setCurrentItemId(item.id);
                                  setModalVisible(true);
                                } else {
                                  handleStatusUpdate(item.id, item.clientInRoute[0].status, selected, setStatuses);
                                }
                                setStatusValue(item.clientInRoute[0].status);
                              }}
                              placeholder=""
                              containerStyle={{
                                height: 34,
                                width: 120,
                                borderColor: statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status],
                              }}
                              style={{
                                color: statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status],
                              }}
                              showValue
                              editable={
                                item.clientInRoute?.[0]?.status === RouteStatus.AVAILABLE ||
                                (item.clientInRoute?.[0]?.status !== RouteStatus.VISITED &&
                                  item.clientInRoute?.[0]?.updateBy?.id === user.id)
                              }
                              backgroudDisabled={false}
                              canWrite={false}
                              arrowSize={18}
                              arrowColor={statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status]}
                              icon={item.clientInRoute?.[0]?.updateBy?.id === user.id ? true : false}
                              selectsContainerWidth={120}
                            />
                            <ArrowRight color={Colors.GRAY} width={24} height={24} style={styles.arrow} />
                          </Row>
                        </Flex>
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
            </View>
          }
        />
      )}
      {seeClientInfo && (
        <BottomSheet
          isOpen={seeClientInfo}
          setIsOpen={setSeeClientInfo}
          content={
            <View style={styles.bottomSheet_container}>
              <BottomSheetFlatList
                data={[{ ...clientInfo }]}
                style={styles.bottomSheet_content_container}
                nestedScrollEnabled={true}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.item}>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Text textColor={Colors.black} fontSize={14} fontWeight={300}>
                          {item.name}
                        </Text>
                        <View>
                          <CustomSelect
                            data={customSelectData}
                            value={truncateText(routeStatusDictionary[statuses[item.id]], 10)}
                            label=""
                            loading={false}
                            onBlur={() => {}}
                            onChange={() => {}}
                            placeholder=""
                            containerStyle={{
                              height: 34,
                              width: 100,
                              alignSelf: 'flex-start',
                              borderColor: statuses?.[item?.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status],
                            }}
                            style={{
                              color: statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status],
                            }}
                            showValue
                            editable={item.clientInRoute[0].status === RouteStatus.AVAILABLE && !seeClientInfo}
                            backgroudDisabled={false}
                            canWrite={false}
                            arrowSize={18}
                            arrowColor={statuses?.[item.clientInRoute[0].status] || statusColors[item.clientInRoute[0].status]}
                            icon={false}
                          />
                        </View>
                      </Flex>
                      <View style={styles.divider} />
                      <Column gap={8}>
                        <Flex alignItems="center" gap={8}>
                          <Row alignItems="center" gap={8} style={styles.input_group}>
                            <UserOutlined color={Colors.black} />
                            <Text fontWeight={300} fontSize={14} textColor={Colors.GRAY}>
                              Referente
                            </Text>
                          </Row>
                          <TextInput value={item.managerName} editable={false} container={styles.input} />
                        </Flex>
                        <Flex alignItems="center" gap={8}>
                          <Row alignItems="center" gap={8} style={styles.input_group}>
                            <Location color={Colors.black} />
                            <Text fontWeight={300} fontSize={14} textColor={Colors.GRAY}>
                              Direccion
                            </Text>
                          </Row>
                          <TextInput value={item.address} editable={false} container={styles.input} />
                        </Flex>
                        <Flex alignItems="center" gap={8}>
                          <Row alignItems="center" gap={8} style={styles.input_group}>
                            <Phone color={Colors.black} />
                            <Text fontWeight={300} fontSize={14} textColor={Colors.GRAY}>
                              Contacto
                            </Text>
                          </Row>
                          <TextInput value={item.phone} editable={false} container={styles.input} />
                        </Flex>
                      </Column>
                    </View>
                  );
                }}
              />
            </View>
          }
          snapPoints={[StyleSheet.hairlineWidth, '55%', '55%']}
        />
      )}
      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          handleStatusUpdate(currentItemId!, statusValue as RouteStatus, selectedStatusPending!, setStatuses);
          setModalVisible(false);
        }}
        title="¿Desea marcar como visitado?"
        content={<Text>Esta acción es irreversible. ¿Estás seguro de que deseas continuar?</Text>}
      />
    </>
  );
}
