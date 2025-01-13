import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { CustomSelect } from '../commons/custom-select/custom-select.component';
import { Calendar } from '../commons/calendar/calendar.component';
import { Button, Column, Container, KeyboardContainer, Row, TextInput, Text, CustomModal, Center, Checkbox } from '../commons';
import * as Yup from 'yup';
import { Order, ProductListResponse, ProductResponse } from '@/services/product.services';
import { Colors } from '@/utils';
import { ActivityIndicator, Image, Platform, Pressable, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from '@/styles/sales/budget.styles';
import { TextInput as RNTextInput } from 'react-native';
import dayjs from 'dayjs';
import { ArrowDown, ArrowLeftFilled, Cross, Search } from '../../../assets/svg';
import { SelectValuesProps } from '@/app/(sales)/sales_detail';
import { useUserStore } from '@/zustand/user/user.store';
import { useOrderStore } from '@/zustand/order/order.store';
import { PaymentType } from '@/app/(orders)/order';
import { router } from 'expo-router';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ClientResponse, ClientsResponse } from '@/utils/routes/routes.clients.service';
import { useClientStore } from '@/zustand/client/client.store';
import ModalSplash from '../splash/modal.splash';
import { staticImages } from '../../../assets/images';

export enum OrderStatus {
  REQUEST = 'REQUEST',
  PREPARATION = 'PREPARATION',
  READY_PICKUP = 'READY_PICKUP',
  EGRESS = 'EGRESS',
  DELIVERED = 'DELIVERED',
  PREORDER = 'PREORDER',
}
export interface CustomSelectedDetail {
  id: string;
  title: string;
  fixedPrice: number;
  amount: string;
  discountPercent: number;
  type: string;
  reload: boolean;
  stock: number;
  product: {
    id: string;
  };
}

const validationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required('Nombre del cliente es obligatorio')
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'El nombre no debe tener más de 30 caracteres'),
  documentId: Yup.string()
    .required('R.U.T./ CI es obligatorio')
    .min(8, 'El RUT debe tener al menos 8 caracteres')
    .max(12, 'El RUT no debe tener más de 12 caracteres')
    .matches(/^\d+$/, 'El RUT debe contener solo números'),
  contact: Yup.string()
    .required('Contacto es obligatorio')
    .matches(/^\d{1,20}$/, 'El contacto debe contener solo números y un máximo de 20 caracteres'),
  saleDate: Yup.date().required('Fecha de venta es obligatoria'),
  discountPercent: Yup.object({ id: Yup.string() }),
});

export interface Discounts {
  [key: string]: string;
}

interface BudgetFormProps {
  selectedDetails: CustomSelectedDetail[];
  listsMapped: (ProductResponse | ProductListResponse)[];
  productsMapped: ProductResponse[];
  isEditable: boolean;
  onDateChange: (date: Date, setFieldValue: (field: string, value: unknown) => void) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedList: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
    }>
  >;
  handleSelectChange: (
    value: SelectValuesProps & { value?: string },
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void,
    values: {
      discountPercent: Discounts;
    },
    selectedItem?: CustomSelectedDetail,
  ) => void;
  handleDiscountChange: (
    value: string,
    values: string,
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void,
  ) => void;
  params: {
    name: string;
    budgetId: string;
    clientID: string;
  };
  selectedDate: string;
  removeItem: (id: string) => void;
  client: ClientResponse | null;
  setSelectedDetails: Dispatch<SetStateAction<CustomSelectedDetail[]>>;
  selectedList: {
    id: string;
    name: string;
  };
  clients: ClientResponse[];
  isChecked: boolean | null;
  setIsChecked: Dispatch<SetStateAction<boolean | null>>;
  loadMoreLists: () => void;
  loadMoreProducts: () => void;
  showSplashModal: boolean;
  setShowSplashModal: Dispatch<SetStateAction<boolean>>;
}

type FormProps = {
  detail: string;
  clientName: string;
  documentId: string;
  contact: string;
  saleDate: string;
  subTotal: string;
  iva: string;
  discountPercent: Discounts;
  total: string;
  list: string;
  amount: { [key: string]: string };
};

const BudgetForm: React.FC<BudgetFormProps> = ({
  selectedDetails,
  listsMapped,
  productsMapped,
  isEditable,
  onDateChange,
  open,
  setOpen,
  handleSelectChange,
  params,
  setSelectedList,
  selectedDate,
  removeItem,
  handleDiscountChange,
  client,
  setSelectedDetails,
  selectedList,
  clients,
  isChecked,
  setIsChecked,
  loadMoreLists,
  loadMoreProducts,
  showSplashModal,
  setShowSplashModal,
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const formikRef = useRef<FormikProps<FormProps>>(null);

  const { selectedOrder, loading, createOrder, updateOrder, error, fetchPreOrders } = useOrderStore();
  const { client: clientFromStore, getClientById, clearClient } = useClientStore();
  const [pendingState, setPendingState] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [warningModal, setWarningModal] = useState(false);
  const [quantityModal, setQuantityModal] = useState(false);
  const [quantityMessages, setQuantityMessages] = useState('');
  const clientsData = clients as unknown as ClientsResponse;
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string }>({
    id: client?.id ?? '',
    name: client?.name ?? '',
  });
  const clientStore = clientFromStore as ClientResponse;

  dayjs.extend(customParseFormat);

  const handleSubmit = async (values: FormProps) => {
    const parsedDate = dayjs(selectedDate ? selectedDate : values.saleDate, 'DD/MM/YYYY');

    const payload = {
      status: OrderStatus.REQUEST,
      discountPercent: 0,
      isPreOrder: true,
      dueDate: null,
      payDate: null,
      sellDate: parsedDate,
      paymentType: PaymentType.CASH,
      isDelivered: false,
      isDirect: false,
      listId: selectedList.id ?? '',
      productInOrder: selectedDetails.map((item) => ({
        fixedPrice: String(item.fixedPrice),
        amount: String(values.amount[item.id] || '0'),
        isRecharge: item.reload ?? false,
        discountPercent: String(values.discountPercent[item.id] || '0'),
        product: {
          id: item.id,
        },
        itemsRemoval: [],
      })),
      client: {
        name: values.clientName,
        phone: values.contact,
        rut: values.documentId,
        status: 'POTENTIAL',
      },
      user: {
        id: user?.id || '',
      },
    };

    try {
      if (params.budgetId) {
        await updateOrder(params.budgetId, payload);
      } else {
        await createOrder(payload);
      }
      if (!error) {
        setShowSplashModal(true);
      }
    } catch (error) {
      console.log('error');
    } finally {
      const initialPaginationParams = {
        itemsPerPage: 10,
        page: 0,
        order: Order.ASC,
        isPreOrder: true,
      };

      await fetchPreOrders(initialPaginationParams, '');
    }
  };

  const fetchClientById = useCallback(async () => {
    (async () => getClientById(selectedClient.id))();
  }, [getClientById, selectedClient]);

  useEffect(() => {
    (async () => fetchClientById())();
    return () => clearClient();
  }, [clearClient, fetchClientById, selectedClient]);

  useEffect(() => {
    if (!params.budgetId && clientStore && formikRef.current) {
      formikRef.current.setFieldValue('clientName', clientStore.name || '');
      formikRef.current.setFieldValue('documentId', clientStore.rut || '');
      formikRef.current.setFieldValue('contact', clientStore.phone || '');
    }
  }, [clientStore, params.budgetId]);

  const { totalPrice, ivaAmount, totalDiscount } = useMemo(() => {
    const totalPrice = selectedDetails.reduce((total, product) => {
      const { fixedPrice, amount, discountPercent } = product;

      const productTotal = fixedPrice * Number(amount) * (1 - discountPercent / 100);
      return total + productTotal;
    }, 0);

    const ivaAmount = totalPrice * 0.22;

    const totalDiscount = selectedDetails.reduce((total, product) => {
      return total + (product.discountPercent || 0);
    }, 0);

    return { totalPrice, ivaAmount, totalDiscount };
  }, [selectedDetails]);

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={Colors.black} />
      </Center>
    );
  }

  const handleModalResponse = (response: boolean) => {
    if (response) {
      setSelectedList(pendingState);
    }
  };

  const handleChangeList = (listName: string) => {
    setWarningModal(true);
    if (pendingState.id !== listName) {
      setSelectedList(pendingState);
    }
  };

  console.log(selectedDetails);

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={{
          clientName: (params.budgetId ? selectedOrder?.client?.name : client?.name) || '',
          documentId: (params.budgetId ? selectedOrder?.client?.rut : client?.rut) || '',
          contact: (params.budgetId ? selectedOrder?.client?.phone : client?.phone) || '',
          saleDate: (params.budgetId && selectedOrder?.created_at) || '',
          subTotal: '',
          iva: '',
          discountPercent:
            selectedDetails.reduce((acc, detail) => {
              acc[detail.id] = detail.discountPercent.toString();
              return acc;
            }, {} as Discounts) || '',
          total: '',
          list: '',
          detail: '',
          amount:
            selectedDetails.reduce(
              (acc, detail) => {
                acc[detail.id] = detail.amount.toString();
                return acc;
              },
              {} as { [key: string]: string },
            ) || '',
        }}
        validationSchema={validationSchema}
        validateOnChange
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldError }) => {
          return (
            <KeyboardContainer>
              <Container gap={24} paddingHorizontal={12} paddingVertical={Platform.OS === 'ios' ? 12 : 24} grow={1}>
                <Column gap={12} style={{ backgroundColor: Colors.white, flex: 1 }}>
                  {!params.budgetId && !params.clientID && (
                    <>
                      <CustomSelect
                        data={clientsData.result.map((item) => ({ name: item.name, id: item.id }))}
                        label="Empresa"
                        loading={false}
                        onBlur={() => {}}
                        onChange={(value) => {
                          setSelectedClient(value);
                        }}
                        placeholder="Nombre del cliente"
                        value={selectedClient ? selectedClient.name : ''}
                        showValue={!isChecked}
                        canWrite={false}
                        error={touched.clientName ? errors.clientName : ''}
                        editable={!isChecked}
                        backgroudDisabled={!!isChecked}
                        emptyText="Actualmente no tienes clientes registrados en el sistema."
                      />
                      {!params.clientID && (
                        <Row gap={4}>
                          <Checkbox
                            isChecked={Boolean(isChecked)}
                            onPress={(value) => {
                              if (value === false) {
                                setIsChecked(null);
                              } else {
                                setIsChecked(true);
                                setSelectedClient({
                                  id: '',
                                  name: '',
                                });
                                setFieldValue('clientName', '');
                                setFieldValue('documentId', '');
                                setFieldValue('contact', '');
                              }
                            }}
                            fillColor={Colors.SKY_BLUE}
                          />
                          <Text>Es cliente nuevo</Text>
                        </Row>
                      )}
                    </>
                  )}
                  <TextInput
                    label="Nombre del cliente"
                    onChangeText={handleChange('clientName')}
                    value={values.clientName}
                    error={touched.clientName && errors.clientName ? errors.clientName : ''}
                    editable={
                      isChecked === null
                        ? false
                        : true || !(client || params.budgetId) || (isEditable && !params.budgetId && !Boolean(client))
                    }
                  />
                  <TextInput
                    label="R.U.T./ CI"
                    onChangeText={handleChange('documentId')}
                    value={values.documentId}
                    error={touched.documentId && errors.documentId ? errors.documentId : ''}
                    editable={
                      isChecked === null
                        ? false
                        : true || !(client || params.budgetId) || (isEditable && !params.budgetId && !Boolean(client))
                    }
                    keyboardType="number-pad"
                  />
                  <TextInput
                    label="Contacto"
                    onChangeText={handleChange('contact')}
                    value={values.contact}
                    error={touched.contact && errors.contact ? errors.contact : ''}
                    editable={
                      isChecked === null
                        ? false
                        : true || !(client || params.budgetId) || (isEditable && !params.budgetId && !Boolean(client))
                    }
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    onPress={() => setOpen(true)}
                    disabled={!Boolean(client || isEditable || params.budgetId) || Boolean(params.budgetId)}
                  >
                    <Text style={styles.calendar_label}>Fecha de Presupuesto</Text>
                    <Row
                      alignItems="center"
                      justifyContent="space-between"
                      style={[
                        styles.calendar_input_container,
                        !Boolean(client || isEditable || params.budgetId) || !params.budgetId ? {} : styles.calendar_input_disabled,
                      ]}
                    >
                      <RNTextInput
                        placeholder="DD/MM/YYYY"
                        value={
                          selectedOrder?.created_at && params.budgetId
                            ? dayjs(selectedOrder?.created_at).format('DD/MM/YYYY')
                            : selectedDate || ''
                        }
                        editable={false}
                        style={styles.calendar_input}
                      />
                      {isEditable && <ArrowDown />}
                    </Row>
                    {touched.saleDate && errors.saleDate && (
                      <Text textColor={Colors.RED} style={styles.input_error_message}>
                        {errors.saleDate}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {!params.budgetId || isEditable === true ? (
                    <>
                      <CustomSelect
                        data={listsMapped}
                        label="Detalle"
                        loading={false}
                        onBlur={() => {}}
                        onChange={(value) => {
                          setSelectedList(value);
                          if (selectedDetails.length) {
                            setPendingState(value);
                            handleChangeList(value.id);
                          }
                        }}
                        placeholder="Elegir lista de precios..."
                        value={selectedList.name}
                        showValue
                        onLoadMore={loadMoreLists}
                      />
                      <CustomSelect
                        data={listsMapped ? productsMapped : []}
                        label=""
                        loading={false}
                        onBlur={() => {}}
                        onChange={(value) => {
                          console.log(value);
                          handleSelectChange(value, setFieldValue, values);
                        }}
                        placeholder="Buscar productos"
                        value={values.detail}
                        leftIcon={<Search color={Colors.GRAY} />}
                        error={touched.detail && errors.detail ? errors.detail : ''}
                        editable={!!selectedList.id && isEditable}
                        onLoadMore={loadMoreProducts}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {selectedDetails && selectedDetails.length > 0 && (
                    <View style={{ marginTop: 10, gap: 4 }}>
                      <Row justifyContent="space-between">
                        <Text style={styles.flex_3}>Producto</Text>
                        <Text style={styles.flex_1}>Cant.</Text>
                        <Text style={styles.flex_1}>Desc.</Text>
                      </Row>
                      <FlatList
                        data={selectedDetails}
                        extraData={selectedDetails}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item }) => {
                          return (
                            <Row gap={8}>
                              <Row
                                style={[styles.flex_3, styles.product, !isEditable ? styles.product_disabled : {}]}
                                justifyContent="space-between"
                              >
                                <View style={styles.product_container}>
                                  <Text fontSize={14}>{item.title?.slice(0, 12)}.</Text>
                                  <Text textColor={Colors.GRAY}>(${item.fixedPrice})</Text>
                                </View>
                                {isEditable && (
                                  <Pressable onPress={() => removeItem(item.id)}>
                                    <Cross color={Colors.black} style={styles.cross} />
                                  </Pressable>
                                )}
                              </Row>
                              <TextInput
                                label=""
                                editable={isEditable}
                                value={params.budgetId ? String(item.amount ?? '1') : String(item.amount ?? '1')}
                                onChangeText={(text) => {
                                  const numericValue = Number(text) || 0;
                                  const productStock = item.stock || 0;

                                  if (numericValue < 0 || numericValue > productStock) {
                                    setQuantityMessages(`Solo puedes seleccionar hasta ${productStock} unidades de este producto.`);
                                    setQuantityModal(true);
                                    return;
                                  }

                                  setFieldValue('amount', {
                                    ...values.amount,
                                    [item.id]: numericValue,
                                  });

                                  handleSelectChange(
                                    {
                                      value: String(text),
                                      ...item,
                                      name: '',
                                    },
                                    setFieldValue,
                                    values,
                                  );
                                }}
                                error={touched.amount && errors.amount ? String(errors.amount) : ''}
                                container={styles.flex_1}
                                keyboardType="number-pad"
                              />

                              <TextInput
                                label=""
                                editable={isEditable}
                                value={String(values.discountPercent[item.id] || '')}
                                onChangeText={(text) => {
                                  setFieldValue('discountPercent', {
                                    ...values.discountPercent,
                                    [item.id]: text,
                                  });
                                  handleDiscountChange(text, item.id, setFieldValue);
                                }}
                                error={touched.discountPercent && errors.discountPercent ? String(errors.discountPercent) : ''}
                                container={styles.flex_1}
                                icon={<Text>%</Text>}
                                keyboardType="number-pad"
                              />
                            </Row>
                          );
                        }}
                        contentContainerStyle={{ gap: 8 }}
                      />
                    </View>
                  )}
                  <Row gap={8}>
                    <TextInput
                      label="Sub total"
                      editable={false}
                      value={`$${totalPrice.toFixed(2)}`}
                      onChangeText={handleChange('subTotal')}
                      error={touched.subTotal && errors.subTotal ? errors.subTotal : ''}
                      container={styles.flex_3}
                    />
                    <TextInput
                      label="IVA 22%"
                      editable={false}
                      value={`$${ivaAmount.toFixed(0)}`}
                      onChangeText={handleChange('iva')}
                      error={touched.iva && errors.iva ? errors.iva : ''}
                      container={styles.flex_1}
                    />
                    <TextInput
                      label="Desc."
                      editable={false}
                      value={`${totalDiscount || '0'}`}
                      onChangeText={handleChange('discounts')}
                      container={styles.flex_1}
                      icon={<Text>%</Text>}
                    />
                  </Row>
                  <TextInput
                    label="Total"
                    editable={false}
                    value={`$${(totalPrice + ivaAmount).toFixed(2)}`}
                    onChangeText={handleChange('total')}
                    error={touched.total && errors.total ? errors.total : ''}
                    style={styles.flex_1}
                  />
                </Column>
                <Calendar
                  isVisible={open}
                  date={new Date()}
                  onDateChange={(date) => onDateChange(date, setFieldValue)}
                  onClose={() => setOpen(false)}
                />
                {isEditable && (
                  <Row justifyContent="space-between">
                    <Button
                      onPress={() => router.back()}
                      type="text"
                      leftIcon={<ArrowLeftFilled color={Colors.black} width={16} height={16} />}
                    >
                      Volver
                    </Button>
                    <Button onPress={handleSubmit}>Aceptar</Button>
                  </Row>
                )}
              </Container>
            </KeyboardContainer>
          );
        }}
      </Formik>
      <CustomModal
        isVisible={warningModal}
        onClose={() => {
          setWarningModal(false);
          handleModalResponse(false);
        }}
        onConfirm={() => {
          setWarningModal(false);
          handleModalResponse(true);
          setSelectedDetails([]);
        }}
        title="Cambiar lista de precios"
        content={<Text>Al cambiar la lista de precios se eliminarán los productos seleccionados ¿Desea continuar?</Text>}
      />
      {showSplashModal && (
        <ModalSplash
          content={
            <Column gap={32} justifyContent="center" alignItems="center">
              <Text fontSize={24} textColor={Colors.white} fontWeight={700} transform="uppercase">
                {params.budgetId ? 'Cambios guardados' : 'Presupuesto generado'}
              </Text>
              <Image source={params.budgetId ? staticImages.SAVED : staticImages.GENERATE_ORDER} />
              <Text fontSize={14} fontWeight={700} textColor={Colors.white} textAlign="center">
                {params.budgetId
                  ? 'Los cambios realizados se guardaron exitosamente.'
                  : 'El presupuesto fue cargado en el sistema exitosamente.'}
              </Text>

              <Button
                onPress={() => (params.clientID ? router.replace('/(tabs)/clientes') : router.back())}
                textColor={Colors.RED}
                backgroundColor={Colors.white}
              >
                Aceptar
              </Button>
            </Column>
          }
        />
      )}

      <CustomModal
        isVisible={quantityModal}
        onClose={() => setQuantityModal(false)}
        content={<Text>{quantityMessages}</Text>}
        title="Cantidad no permitida"
      />
    </>
  );
};

export default BudgetForm;
