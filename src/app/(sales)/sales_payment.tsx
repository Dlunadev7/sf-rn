import { ActivityIndicator, Image, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardContainer, Container, Column, Row, Text, TextInput, Button, Checkbox, CustomModal } from '@/components/commons';
import { Calendar } from '@/components/commons/calendar/calendar.component';
import { Colors, scaleSize } from '@/utils';
import { ButtonType } from '@/utils/types/button.type';
import dayjs from 'dayjs';
import { router, useNavigation } from 'expo-router';
import { Formik } from 'formik';
import { ArrowLeftFilled } from '../../../assets/svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useClientStore } from '@/zustand/client/client.store';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import { validationPaymentSchema } from '@/utils/validations/clients/clients.validations';
import { useUserStore } from '@/zustand/user/user.store';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useOrderStore } from '@/zustand/order/order.store';
import { OrderStatus } from '@/services/order.service';
import { OrdersRoutesLink } from '@/utils/routes/orders.routes';
import ModalSplash from '@/components/splash/modal.splash';
import { staticImages } from '../../../assets/images';

type Products = {
  fixedPrice: number;
  amount: number;
  discount: number;
  id: string;
  reload: boolean;
  productsInOrder: {
    barcode: number;
    unit: number;
    factoryUnit: number;
    lastRecharge: string;
    matricula: number;
  }[];
};

export enum PaymentType {
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  CHECK = 'CHECK',
}

export type CheckItem = {
  number: string;
  amount: string;
};

export default function SalesPayment() {
  const { params } =
    useRoute<RouteProp<{ params: { clientID: string; saleDate: string; selectedDetails: string; isDirect?: string; listID: string } }>>();
  const { clientID, selectedDetails, isDirect = false, saleDate } = params;
  const { getClientById, loading } = useClientStore();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('DD/MM/YYYY'));
  const [isChecked, setIsChecked] = useState(false);
  const handleClose = () => setOpen(false);
  const { user } = useUserStore();
  const { createOrder } = useOrderStore();
  const [isOpen, setIsOpen] = useState(false);
  const [checkCount, setCheckCount] = useState(1);
  const [checksItems, setChecksItems] = useState<CheckItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showSplashModal, setShowSplashModal] = useState(false);
  const details = JSON.parse(selectedDetails) || [];
  const navigator = useNavigation();
  const handleCheckCountChange = (value: string = '1') => {
    const count = parseInt(value, 10) || 0;
    setCheckCount(count);

    const newChecks = Array.from({ length: count }, (_, index) => {
      return checksItems[index] || { number: '', amount: '' };
    });
    setChecksItems(newChecks);
  };

  const handleCheckItemChange = (index: number, field: keyof CheckItem, value: string) => {
    const updatedChecks = [...checksItems];
    updatedChecks[index][field] = value;
    setChecksItems(updatedChecks);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      if (params?.clientID) {
        try {
          await getClientById(params.clientID);
        } catch (error) {
          setIsOpen(true);
        }
      } else {
      }
    };

    fetchClientData();
  }, [getClientById, params]);

  const initialValues = {
    saleDate: selectedDate,
    discount: '',
    subTotal: '',
    iva: '',
    total: '',
    delivered: false,
    deliveredBy: '',
    paymentMethod: '',
  };

  const totalPrice = useMemo(() => {
    const products = JSON.parse(selectedDetails);
    return products.reduce((acc: number, detail: { fixedPrice: number; amount: number }) => {
      const subtotal = detail.fixedPrice * detail.amount;
      return acc + subtotal;
    }, 0);
  }, [selectedDetails]);

  const totalIVA: number = useMemo(() => {
    const products = JSON.parse(selectedDetails);
    return products.reduce((acc: number, detail: { fixedPrice: number; amount: number }) => {
      const subtotal = detail.fixedPrice * detail.amount;
      const iva = subtotal * 0.22;
      return acc + iva;
    }, 0);
  }, [selectedDetails]);

  dayjs.extend(customParseFormat);

  const parsedDate = dayjs(saleDate, 'DD/MM/YYYY');

  const paymentMapping: { [key: string]: PaymentType } = {
    Efectivo: PaymentType.CASH,
    Cheque: PaymentType.CHECK,
    Crédito: PaymentType.CREDIT,
  };
  const handleSubmit = async (values: typeof initialValues) => {
    const products = JSON.parse(selectedDetails);
    const checkItemsParsed = JSON.stringify(checksItems);
    const payload = {
      status: isChecked || params.isDirect ? OrderStatus.DELIVERED : OrderStatus.REQUEST,
      paymentType: selectedPaymentMethod as PaymentType,
      payCheck: checkItemsParsed,
      listId: params.listID,
      isDelivered: isChecked ? true : false,
      discountPercent: 0,
      isDirect: Boolean(isDirect),
      isPreOrder: false,
      sellDate: parsedDate,
      dueDate: null,
      payDate: null,
      workShopDateEntry: parsedDate,
      clientAuthorize: values.deliveredBy || '',
      productInOrder: products.map((detail: Products) => ({
        fixedPrice: String(detail.fixedPrice || 0),
        amount: String(detail.amount || 1),
        isRecharge: detail.productsInOrder.length > 0 ? true : false,
        discountPercent: String(detail.discount || 0),
        product: {
          id: detail.id,
        },
        itemsRemoval:
          detail.productsInOrder.length > 0
            ? detail.productsInOrder.map((product) => ({
                barCode: product.barcode || '000',
                enrollment: product.matricula || '000',
                lastDate: product.lastRecharge,
                numberUNIT: product.unit || '000',
                fabricUNIT: product.factoryUnit || '000',
                capacity: '0',
              }))
            : [],
      })),
      client: {
        id: clientID,
        isOneTime: Boolean(isDirect),
      },
      user: {
        id: user?.id || '',
      },
    };

    try {
      await createOrder(payload);
      setShowSplashModal(true);
    } catch (error) {}
  };

  const onDateChange = (date: Date, setFieldValue: (field: string, value: unknown) => void) => {
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    setSelectedDate(formattedDate);
    setFieldValue('saleDate', formattedDate);
  };

  useEffect(() => {
    if (checkCount > checksItems.length) {
      const newChecks = Array.from({ length: checkCount - checksItems.length }, () => ({
        number: '',
        amount: '',
      }));
      setChecksItems((prevChecks) => [...prevChecks, ...newChecks]);
    } else if (checkCount < checksItems.length) {
      setChecksItems((prevChecks) => prevChecks.slice(0, checkCount));
    }
  }, [checkCount, checksItems.length]);

  const totalDiscount = details?.reduce((accumulator: string, item: { discount: number }) => accumulator + item.discount, 0);

  useEffect(() => {
    navigator.setOptions({
      headerShown: !showSplashModal,
    });
  }, [navigator, showSplashModal]);

  return (
    <>
      <KeyboardContainer>
        <Container gap={24} paddingHorizontal={12} paddingVertical={Platform.OS === 'ios' ? 12 : 24} grow={1}>
          <Text fontSize={18} fontWeight={500}>
            3. Forma de Pago
          </Text>
          <Formik initialValues={initialValues} validationSchema={validationPaymentSchema} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
              return (
                <>
                  <Column gap={12} style={{ backgroundColor: Colors.white, flex: 1 }}>
                    <Column gap={12}>
                      <Row gap={8}>
                        <TextInput label="Sub total" editable={false} value={`$${totalPrice || ''}`} container={styles.flex_3} />
                        <TextInput label="IVA 22%" editable={false} value={`${totalIVA.toFixed(2)}`} container={styles.flex_1_5} />

                        <TextInput
                          label="Desc."
                          editable={false}
                          value={String(totalDiscount)}
                          onChangeText={(text) => {
                            const cleanText = text.replace(/\D/g, '').slice(0, 3);

                            const numericValue = parseInt(cleanText, 10);
                            if (numericValue > 100) {
                              setFieldValue('discount', '100');
                            } else {
                              setFieldValue('discount', cleanText);
                            }
                          }}
                          container={styles.flex_1_5}
                          keyboardType="number-pad"
                          icon={<Text>%</Text>}
                        />
                      </Row>

                      <TextInput
                        label="Total"
                        editable={false}
                        placeholder="..."
                        value={`$${((Number(totalPrice) + Number(totalIVA)) * (1 - Number(values.discount) / 100)).toFixed(2)}`}
                      />

                      <CustomSelect
                        data={[{ name: 'Efectivo' }, { name: 'Cheque' }, { name: 'Crédito' }]}
                        label="Forma de pago"
                        loading={false}
                        onBlur={() => {}}
                        onChange={(value) => {
                          const mappedValue = paymentMapping[value.name] || 'Efectivo';

                          setSelectedPaymentMethod(mappedValue);
                          setFieldValue('paymentMethod', value.name);
                        }}
                        placeholder="Seleccionar forma de pago"
                        value={values.paymentMethod}
                        canWrite={false}
                        backgroudDisabled={false}
                        showValue
                        error={touched.paymentMethod && errors.paymentMethod ? errors.paymentMethod : ''}
                      />

                      {selectedPaymentMethod === 'CHECK' && (
                        <Column gap={8}>
                          <Row>
                            <TextInput
                              label="Cant."
                              placeholder="Cantidad de cheques"
                              keyboardType="number-pad"
                              container={styles.input_middle}
                              onChangeText={handleCheckCountChange}
                              value={checkCount.toString()}
                            />
                          </Row>
                          {checksItems.length ? (
                            <Row alignItems="center">
                              <Text style={styles.input}>N° de Cheque</Text>
                              <Text style={styles.input}>Valor</Text>
                            </Row>
                          ) : (
                            <></>
                          )}
                          {checksItems.map((check, index) => (
                            <Column gap={8}>
                              <Row key={index} gap={8} alignItems="center">
                                <TextInput
                                  placeholder="Número"
                                  container={styles.input}
                                  value={check.number}
                                  onChangeText={(value) => handleCheckItemChange(index, 'number', value)}
                                  keyboardType="number-pad"
                                />
                                <TextInput
                                  placeholder="Valor"
                                  keyboardType="number-pad"
                                  container={styles.input}
                                  value={check.amount}
                                  onChangeText={(value) => handleCheckItemChange(index, 'amount', value)}
                                />
                              </Row>
                            </Column>
                          ))}
                        </Column>
                      )}

                      <TextInput
                        label="Compra autorizada por:"
                        placeholder="Nombre del cliente"
                        onChangeText={handleChange('deliveredBy')}
                        onBlur={handleBlur('deliveredBy')}
                        value={values.deliveredBy}
                        error={touched.deliveredBy && errors.deliveredBy ? errors.deliveredBy : ''}
                      />

                      {!params.isDirect && (
                        <Row gap={4}>
                          <Checkbox
                            isChecked={isChecked}
                            onPress={() => {
                              setIsChecked(!isChecked);
                            }}
                            fillColor={Colors.SKY_BLUE}
                          />
                          <Text>Entregado</Text>
                        </Row>
                      )}
                    </Column>
                  </Column>

                  <Calendar
                    isVisible={open}
                    date={new Date()}
                    onDateChange={(date) => onDateChange(date, setFieldValue)}
                    onClose={handleClose}
                    setOpen={setOpen}
                  />
                  <Row style={styles.button_group} justifyContent="space-between">
                    <Button onPress={() => router.back()} type={ButtonType.TEXT} leftIcon={<ArrowLeftFilled color={Colors.black} />}>
                      Volver
                    </Button>
                    <Button onPress={handleSubmit} shadow={false} loading={loading}>
                      {loading ? <ActivityIndicator color={Colors.black} /> : 'Aceptar'}
                    </Button>
                  </Row>
                </>
              );
            }}
          </Formik>
          <CustomModal
            isVisible={isOpen}
            onClose={() => {
              setIsOpen(false);
              router.back();
            }}
            title="Error al localizar al cliente"
            content={
              <Text>
                Hubo un problema al intentar localizar la información del cliente. Por favor, verifica tu conexión y vuelve a intentarlo.
              </Text>
            }
          />
          {/* <CustomModal
            isVisible={isOpenModal}
            onClose={() => {
              setIsOpenModal(false);
              router.replace(OrdersRoutesLink.ORDERS_DEFAULT);
            }}
            content={<Text>La venta se generó correctamente.</Text>}
            title="Venta Generada"
          /> */}
        </Container>
      </KeyboardContainer>
      {showSplashModal && (
        <ModalSplash
          content={
            <Column gap={32} justifyContent="center" alignItems="center">
              <Text fontSize={24} textColor={Colors.white} fontWeight={700} transform="uppercase">
                Órden generada
              </Text>
              <Image source={staticImages.GENERATE_ORDER} />
              <Text fontSize={14} fontWeight={700} textColor={Colors.white} textAlign="center">
                La órden fue cargada en el sistema{'\n'} exitosamente.
              </Text>

              <Button
                onPress={() => router.replace(OrdersRoutesLink.ORDERS_DEFAULT)}
                textColor={Colors.RED}
                type="outlined"
                backgroundColor={Colors.white}
              >
                Aceptar
              </Button>
            </Column>
          }
        />
      )}
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
    marginVertical: 32,
  },
  flex_3: {
    flex: 3,
  },
  flex_1_5: {
    flex: 1.5,
  },
  input: {
    flex: 1,
  },
  input_middle: {
    flex: 0.5,
    marginRight: 8,
  },
});
