import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Platform, TextInput as RNTextInput, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useClientStore } from '@/zustand/client/client.store';
import { Colors, scaleSize } from '@/utils';
import { Button, Column, Container, KeyboardContainer, Row, Text, TextInput } from '@/components/commons';
import { ButtonType } from '@/utils/types/button.type';
import { Calendar } from '@/components/commons/calendar/calendar.component';
import dayjs from 'dayjs';
import { router, useNavigation } from 'expo-router';
import { ArrowDown, ArrowLeftFilled } from '../../../assets/svg';
import { SalesRoutesLink } from '@/utils/routes/sales.routes';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import { ClientPayload, ClientsResponse } from '@/utils/routes/routes.clients.service';
import { Header } from '@/components/headers';
import { useUserStore } from '@/zustand/user/user.store';

export default function NewSale() {
  const formikRef = useRef<FormikProps<{ saleDate: string; clientName: string | undefined }> | null>(null);
  const { params } = useRoute<RouteProp<{ params: { itemId: string; isDirect: string; clientID: string } }>>();
  const { client, getClientById, clients, getClients, createClient } = useClientStore();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('DD/MM/YYYY'));
  const [selectedClient, setSelectedClient] = useState('');
  const clientsData = clients as unknown as ClientsResponse;
  const navigator = useNavigation();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const handleCreateClient = async (values: typeof initialValues) => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await createClient({
      name: values.clientName,
      isOneTime: true,
      user: [
        {
          id: user.id,
        },
      ],
    } as ClientPayload);

    router.push({
      pathname: SalesRoutesLink.SALES_DETAIL,
      params: {
        clientID: response.id,
        saleDate: values.saleDate,
        isDirect: params.isDirect,
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      if (params?.itemId) {
        const id = params.clientID ? params.clientID : params.itemId;
        try {
          await getClientById(id);
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      }
    };

    fetchClientData();

    const resetForm = () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    };

    return () => {
      setSelectedClient('');
      resetForm();
    };
  }, [getClientById, params]);

  useEffect(() => {
    const fetchClientsData = async () => {
      if (!params.itemId) {
        try {
          await getClients();
        } catch (error) {
          console.error('Error fetching clients data:', error);
        }
      }
    };
    fetchClientsData();
  }, [getClients, params.itemId]);

  const initialValues = {
    saleDate: selectedDate,
    clientName: params.clientID ? client?.name : selectedClient,
  };

  const validationSchema = Yup.object({
    saleDate: Yup.string().required('Fecha de venta es requerida'),
    clientName: Yup.string().required('Nombre del cliente es requerido'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    router.push({
      pathname: SalesRoutesLink.SALES_DETAIL,
      params: {
        clientID: selectedClient ? selectedClient : client?.id,
        saleDate: values.saleDate,
        isDirect: params.isDirect,
      },
    });
  };

  const onDateChange = (date: Date, setFieldValue: (field: string, value: unknown) => void) => {
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    setSelectedDate(formattedDate);
    setFieldValue('saleDate', formattedDate);
  };

  useEffect(() => {
    navigator.setOptions({
      header: () => <Header onBackPress={() => router.back()} showArrow title="Nueva Venta" background={Colors.white} />,
    });
  }, [navigator]);

  return (
    <>
      <KeyboardContainer>
        <Container gap={24} paddingHorizontal={12} paddingVertical={Platform.OS === 'ios' ? 12 : 24} grow={1}>
          <Text fontSize={18} fontWeight={500}>
            1. Datos del cliente
          </Text>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={params.isDirect ? (payload) => handleCreateClient(payload) : (payload) => handleSubmit(payload)}
          >
            {({ handleSubmit, values, setFieldValue, touched, errors }) => {
              return (
                <>
                  <View style={styles.container}>
                    <Column gap={12} style={{ backgroundColor: Colors.white }}>
                      {!params.isDirect ? (
                        <>
                          {params.itemId || params.clientID ? (
                            <TextInput label="Empresa" editable={false} value={client?.name} />
                          ) : (
                            <CustomSelect
                              data={clientsData.result
                                .filter((client) => !client.isOneTime)
                                .map((item) => ({ name: item.name, id: item.id }))}
                              label="Empresa"
                              loading={false}
                              onBlur={() => {}}
                              onChange={(value) => {
                                setFieldValue('clientName', value.name);
                                setSelectedClient(value.id);
                              }}
                              placeholder="Nombre del cliente"
                              value={values.clientName ?? ''}
                              // showValue
                              error={touched.clientName ? errors.clientName : ''}
                              canWrite
                              editable
                            />
                          )}
                        </>
                      ) : (
                        <TextInput
                          onChangeText={(text) => setFieldValue('clientName', text)}
                          label="Empresa"
                          value={values.clientName}
                          placeholder="Nombre del cliente"
                          error={touched.clientName ? errors.clientName : ''}
                        />
                      )}

                      {params.itemId ||
                        (params.clientID && <TextInput label="R.U.T/CI" editable={false} placeholder="..." value={client?.rut} />)}
                      <TouchableOpacity onPress={handleOpen}>
                        <Text style={styles.calendar_label}>Fecha de venta</Text>
                        <Row alignItems="center" justifyContent="space-between" style={styles.calendar_input_container}>
                          <RNTextInput
                            placeholder="DD/MM/YYYY"
                            value={values.saleDate || dayjs().format('DD/MM/YYYY')}
                            editable={false}
                            style={styles.calendar_input}
                          />
                          <ArrowDown />
                        </Row>
                      </TouchableOpacity>
                    </Column>
                    <Calendar
                      isVisible={open}
                      date={new Date()}
                      onDateChange={(date) => onDateChange(date, setFieldValue)}
                      onClose={handleClose}
                      setOpen={setOpen}
                    />
                  </View>
                  <Row style={styles.button_group} justifyContent="space-between">
                    <Button onPress={() => router.back()} type={ButtonType.TEXT} leftIcon={<ArrowLeftFilled color={Colors.black} />}>
                      Volver
                    </Button>
                    <Button onPress={handleSubmit} shadow={false}>
                      {loading ? <ActivityIndicator color={Colors.white} /> : 'Siguiente'}
                    </Button>
                  </Row>
                </>
              );
            }}
          </Formik>
        </Container>
      </KeyboardContainer>
    </>
  );
}

const styles = StyleSheet.create({
  calendar_label: {
    color: Colors.text,
    marginBottom: 8,
  },
  calendar_input_container: {
    height: scaleSize(44),
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  calendar_input: {
    color: Colors.black,
  },
  button_group: {
    paddingHorizontal: 12,
    marginVertical: 32,
    width: '100%',
  },
  container: {
    flex: 2,
  },
});
