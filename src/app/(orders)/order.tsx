import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, Pressable, TextInput as RNTextInput, View } from 'react-native';
import {
  Accordion,
  Button,
  Checkbox,
  Column,
  Container,
  Counter,
  CustomModal,
  Flex,
  KeyboardContainer,
  Row,
  Text,
  TextInput,
} from '@/components/commons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, scaleSize } from '@/utils';
import { ArrowDown, ArrowLeftFilled, Barcode, Cross, Edit } from '../../../assets/svg';
import { Calendar } from '@/components/commons/calendar/calendar.component';
import dayjs from 'dayjs';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import { Formik } from 'formik';

import * as Yup from 'yup';
import { FlatList } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Header } from '@/components/headers';
import { router, useNavigation } from 'expo-router';
import { useOrderStore } from '@/zustand/order/order.store';
import BarCodeScannerComponent from '@/components/commons/camera/camera.component';
import useProductStore from '@/zustand/products/products.store';
import { PaginationParams } from '@/services/product.services';
import { CheckItem } from '../(sales)/sales_payment';
import { OrderStatus, PayCheck } from '@/services/order.service';
import ModalSplash from '@/components/splash/modal.splash';
import { staticImages } from '../../../assets/images';
import { ValidationError } from '../(sales)/sales_detail';

const validationSchema = Yup.object().shape({
  clientName: Yup.string().required('Nombre del cliente es obligatorio'),
  managerName: Yup.string().required('Compra autorizada es obligatoria'),
  documentId: Yup.string().required('R.U.T./ CI es obligatorio'),
  contact: Yup.string().required('Contacto es obligatorio'),
  saleDate: Yup.date().required('Fecha de venta es obligatoria').max(new Date(), 'No puedes colocar una fecha futura'),
  subTotal: Yup.number().required('Sub total es obligatorio').min(0, 'Debe ser un valor positivo'),
  iva: Yup.number().required('IVA es obligatorio').min(0, 'Debe ser un valor positivo'),
  discount: Yup.number().min(0, 'Debe ser al menos 0%').max(100, 'No puede superar el 100%'),
  total: Yup.number().required('Total es obligatorio').min(0, 'Debe ser un valor positivo'),
});

export enum PaymentType {
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  CHECK = 'CHECK',
}

export type FormProps = {
  unitNumberFactor: string;
  barCode: string;
  matricula: string;
  unitNumber: string;
  saleDateReload: string;
};

interface OpenAccordionsState {
  [key: string]: boolean;
}

interface ActiveCalendar {
  productId: string | null;
  formIndex: number | null;
}
interface ProductForm {
  barcode: string;
  matricula: string;
  factoryUnit: string;
  unit: string;
  quantity: string;
  lastRecharge: string;
}
interface ProductList {
  price: number;
}
interface Product {
  isRecharge?: string | boolean;
  id: string;
  name: string;
  amount: number;
  fixedPrice: number;
  discount: number;
  type: string;
  isToRecharge: string | boolean;
  productsInOrder: ProductForm[];
  list?: ProductList[];
  product: {
    id: string;
  };
  stock: number;
}

const ProductRow = ({ item, isEditable }: { item: Product; isEditable: boolean }) => {
  return (
    <View style={styles.productRowContainer}>
      <Row justifyContent="space-between">
        <Text style={styles.flex_3}>Producto</Text>
        <Text style={styles.flex_1}>Cant.</Text>
        <Text style={styles.flex_1}>Desc.</Text>
      </Row>
      <Row gap={8}>
        <Row style={[styles.flex_3, styles.product, !isEditable ? styles.product_disabled : {}]} justifyContent="space-between">
          <View style={styles.product_container}>
            <Text fontSize={14}>{item.name.slice(0, 12)}.</Text>
            <Text textColor={Colors.GRAY}>(${item.fixedPrice})</Text>
          </View>
          {isEditable && (
            <Pressable onPress={() => {}}>
              <Cross color={Colors.black} style={styles.cross} />
            </Pressable>
          )}
        </Row>
        <TextInput
          label=""
          editable={isEditable}
          value={String(item.amount)}
          onChangeText={() => {}}
          container={styles.flex_1}
          icon={<Text>%</Text>}
        />
        <TextInput
          label=""
          editable={isEditable}
          value={String(item.discount)}
          onChangeText={() => {}}
          container={styles.flex_1}
          icon={<Text>%</Text>}
        />
      </Row>
    </View>
  );
};

export default function Order() {
  const itemsPerPage = 10;

  const params = useRoute().params as { id: string; name: string; isDirect: string };
  const navigator = useNavigation();
  const [open, setOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(!params?.id);
  const { selectedOrder, fetchOrderById, updateOrder, clearOrder } = useOrderStore();
  const { products, lists, fetchProducts, fetchAllList, pagination, fetchListById, list } = useProductStore();
  const [selectedList, setSelectedList] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  const [pendingState, setPendingState] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [warningModal, setWarningModal] = useState(false);
  const [barCodeCamera, setBarCodeCamera] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageProducts, setCurrentPageProducts] = useState(0);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<ActiveCalendar | null>({ productId: null, formIndex: null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOrderDate, setSelectedOrderDate] = useState<Date | null>(null);
  const [openAccordions, setOpenAccordions] = useState<OpenAccordionsState>({});
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | string>('');
  const [managerName, setManagerName] = useState('');
  const [productsInOrder, setProductsInOrder] = useState<Product[]>([]);
  const [checkCount, setCheckCount] = useState(1);
  const [checksItems, setChecksItems] = useState<CheckItem[]>([]);
  const toggleAccordion = (accordionKey: string): void => {
    setOpenAccordions((prev: OpenAccordionsState) => ({
      ...prev,
      [accordionKey]: !prev[accordionKey],
    }));
  };

  const updateProductForms = (productId: string, quantity: number): void => {
    setProductsInOrder((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              amount: quantity,
              productsInOrder:
                product.isToRecharge === 'false' || false
                  ? []
                  : Array.from(
                      { length: quantity },
                      (_, i) =>
                        product.productsInOrder?.[i] || {
                          barcode: '',
                          matricula: '',
                          factoryUnit: '',
                          unit: '',
                          quantity: '',
                          lastRecharge: null,
                        },
                    ),
            }
          : product,
      ),
    );
  };

  const addProductToOrder = (product: Partial<Product>): void => {
    const newProduct: Product = {
      id: product.id || '',
      name: product.name || '',
      fixedPrice: product?.list?.[0]?.price ?? 0,
      amount: 1,
      discount: 0,
      type: product.type || '',
      productsInOrder: product.isToRecharge
        ? [
            {
              barcode: '',
              matricula: '',
              factoryUnit: '',
              unit: '',
              quantity: '',
              lastRecharge: '',
            },
          ]
        : [],
      product: {
        id: product.id || '',
      },
      list: product.list,
      isToRecharge: product?.isToRecharge || false,
      stock: product.stock || 1,
    };

    setProductsInOrder((prev: Product[]) => [...prev, newProduct]);
  };

  const updateFormField = (productId: string, formIndex: number, field: string, value: string): void => {
    setProductsInOrder((prev: Product[]) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              productsInOrder: product.productsInOrder?.map((form, index) => (index === formIndex ? { ...form, [field]: value } : form)),
            }
          : product,
      ),
    );
  };

  const updateProductField = (productId: string, field: string, value: string | number | boolean): void => {
    setProductsInOrder((prev: Product[]) => prev.map((product) => (product.id === productId ? { ...product, [field]: value } : product)));
  };

  const openCalendar = (productId: string, formIndex: number): void => {
    setActiveCalendar({ productId, formIndex });
    setCalendarVisible(true);
  };
  const closeCalendar = () => {
    setActiveCalendar({ productId: null, formIndex: null });
    setCalendarVisible(false);
  };

  const handleDateChange = (date: Date, productId: string, formIndex: number): void => {
    const formattedDate = date.toISOString().split('T')[0];
    updateFormField(productId, formIndex, 'lastRecharge', formattedDate);
    setSelectedDate(date);
    closeCalendar();
  };

  const onDateChange = (date: Date, setFieldValue: (field: string, value: unknown) => void) => {
    setSelectedOrderDate(date);
    setFieldValue('saleDate', date);
  };

  const handleRemoveForm = (productId: string, formIndex: number): void => {
    setProductsInOrder((prev: Product[]) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              amount: product.amount > 0 ? product.amount - 1 : 0,
              productsInOrder: product.productsInOrder?.filter((_, index) => index !== formIndex),
            }
          : product,
      ),
    );
  };

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

  const loadMoreLists = () => {
    if (currentPage >= (pagination.lists?.totalPages ?? 0) - 1) return;
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchAllList(
        {
          page: nextPage,
          itemsPerPage: itemsPerPage,
          order: 'ASC',
          category: '',
          isDirect: Boolean(params.isDirect),
        },
        '',
      );
      return nextPage;
    });
  };

  const loadMoreProducts = () => {
    if (currentPageProducts >= (pagination.product?.totalPages ?? 0) - 1) return;
    setCurrentPageProducts((prevPage) => {
      const nextPage = prevPage + 1;
      fetchProducts(
        {
          page: nextPage,
          itemsPerPage: itemsPerPage,
          order: 'ASC',
          category: '',
          list: selectedList?.id || list?.id,
        },
        '',
      );
      return nextPage;
    });
  };

  const handleSubmit = async () => {
    const sellDate = selectedOrderDate || selectedOrder?.sellDate;

    try {
      if (selectedOrder) {
        const originalProducts = selectedOrder.productInOrder.map((product) => ({
          amount: String(product.amount || 0),
          discountPercent: String(product.discountPercent || 0),
          fixedPrice: String(product.fixedPrice || 0),
          product: { id: product.product.id },
          isRecharge: false,
          itemsRemoval: !product?.isRecharge
            ? []
            : product.itemsRemoval.map((item) => ({
                barCode: item.barCode,
                enrollment: item.enrollment,
                fabricUNIT: item.fabricUNIT,
                numberUNIT: item.numberUNIT,
                lastDate: item.lastDate || '',
              })),
        }));

        const currentProducts = productsInOrder.map((item) => ({
          amount: String(item.amount || 0),
          discountPercent: String(item.discount || 0),
          fixedPrice: String(item.fixedPrice || 0),
          product: { id: item.product.id },
          isRecharge: item.isToRecharge,
          itemsRemoval: item?.isRecharge
            ? []
            : item.productsInOrder.map((product) => ({
                barCode: product.barcode,
                enrollment: product.matricula,
                fabricUNIT: product.factoryUnit,
                numberUNIT: product.unit,
                lastDate: product.lastRecharge || '',
              })),
        }));

        const hasChanges = JSON.stringify(originalProducts) !== JSON.stringify(currentProducts);

        const payload = {
          ...selectedOrder,
          sellDate,
          isDelivered: isChecked,
          clientAuthorize: managerName,
          status: isChecked ? OrderStatus.DELIVERED : OrderStatus.REQUEST,
          ...(selectedPaymentType && { paymentType: selectedPaymentType as PaymentType }),
          ...(hasChanges && { productInOrder: currentProducts }),
        };

        await updateOrder(selectedOrder.id, payload);
      }

      setError(false);
      setShowModal(true);
    } catch (error) {
      setError(true);
      setShowModal(true);
    }
  };

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: 10,
      order: 'ASC',
      category: '',
      isDirect: Boolean(params.isDirect) ? true : false,
    };
    fetchAllList(paginationParams);
  }, [currentPage, fetchAllList, params.isDirect]);

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: 10,
      order: 'ASC',
      category: '',
      list: selectedList.id || list?.id,
    };
    if (selectedList.id || selectedOrder?.listId) {
      fetchProducts(paginationParams, '', false);
    }
  }, [selectedList, fetchProducts, currentPage, selectedOrder, list?.id]);

  useEffect(() => {
    (async () => {
      if (params?.id) {
        await fetchOrderById(params.id);
      }
    })();

    return () => clearOrder();
  }, [clearOrder, fetchOrderById, params.id]);

  console.log('asd', selectedList);

  useEffect(() => {
    navigator.setOptions({
      header: () =>
        !showModal && (
          <Header
            title={params?.name ?? 'Nuevo cliente'}
            showArrow
            rightIcon={
              params.id &&
              selectedOrder?.status === OrderStatus.REQUEST &&
              !isEditable && (
                <TouchableOpacity
                  onPress={() => {
                    setIsEditable(true);
                  }}
                >
                  <Edit color="black" />
                </TouchableOpacity>
              )
            }
            background={Colors.white}
            onBackPress={() => router.back()}
          />
        ),
    });
  }, [params.id, isEditable, navigator, params?.name, selectedOrder?.status, showModal]);

  useEffect(() => {
    if (selectedOrder) {
      const mappedProducts = selectedOrder.productInOrder.map((product) => ({
        id: product.id,
        name: product.product.name,
        amount: product.amount,
        fixedPrice: product.fixedPrice,
        discount: product.discountPercent,
        type: product.product.type,
        isToRecharge: product.product.isToRecharge,
        product: {
          id: product.product.id,
        },
        stock: product.product.stock,
        productsInOrder:
          product.product.isToRecharge === 'false' || false
            ? []
            : product.itemsRemoval.map((itemsRemoval) => ({
                barcode: itemsRemoval.barCode,
                matricula: itemsRemoval.enrollment,
                factoryUnit: itemsRemoval.fabricUNIT,
                unit: itemsRemoval.numberUNIT,
                quantity: '1',
                lastRecharge: itemsRemoval.lastDate || '',
              })),
      }));
      setManagerName(selectedOrder.clientAuthorize ?? '');
      setProductsInOrder(mappedProducts);
    } else {
      setProductsInOrder([]);
    }
    setIsChecked(selectedOrder?.isDelivered ?? false);
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      const parsedChecks: PayCheck[] = JSON?.parse(selectedOrder.payCheck! || '[]');
      setChecksItems(
        parsedChecks?.map((item) => ({
          number: item.number ?? '',
          amount: item.amount ?? '',
        })) ?? [],
      );
    } else {
      setProductsInOrder([]);
    }
  }, [selectedOrder]);

  useEffect(() => {
    (async () => {
      if (selectedOrder?.listId) {
        await fetchListById(selectedOrder.listId);
      }
    })();
  }, [fetchListById, selectedOrder?.listId]);

  const handleChangeList = (listName: string) => {
    setWarningModal(true);
    if (pendingState.id !== listName) {
      setSelectedList(pendingState);
    }
  };

  const handleModalResponse = (response: boolean) => {
    if (response) {
      setSelectedList(pendingState);
    }
  };

  const paymentMapping: { [key: string]: PaymentType } = {
    Efectivo: PaymentType.CASH,
    Cheque: PaymentType.CHECK,
    Crédito: PaymentType.CREDIT,
  };

  const reversePaymentMapping: { [key: string]: string } = Object.fromEntries(
    Object.entries(paymentMapping).map(([key, value]) => [value, key]),
  );

  const totalPrice = useMemo(() => {
    return selectedOrder?.productInOrder?.reduce((total, product) => {
      const { fixedPrice, amount, discountPercent } = product;
      const productTotal = fixedPrice * amount * (1 - discountPercent / 100);
      return total + productTotal;
    }, 0);
  }, [selectedOrder]);

  const totalDiscount = useMemo(() => {
    return productsInOrder?.reduce((accumulator, item) => {
      return accumulator + item.discount;
    }, 0);
  }, [productsInOrder]);

  const total = Number(totalPrice) * (1 + 0.22) * (1 - totalDiscount / 100);

  const validateProducts = (products: Product[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!Boolean(selectedList.id || list?.id) || productsInOrder.length <= 0) {
      return errors;
    }

    products.forEach((product) => {
      const productErrors: { field: string; message: string }[] = [];

      product.productsInOrder?.forEach((order, index) => {
        Object.entries(order).forEach(([key, value]) => {
          if (!value && key !== 'factoryUnit' && key !== 'quantity') {
            let errorMessage: string = '';

            if (key === 'barcode') {
              errorMessage = 'El código de barras es obligatorio';
            } else if (key === 'matricula') {
              errorMessage = 'La matrícula es obligatoria';
            } else if (key === 'unit') {
              errorMessage = 'El número UNIT es obligatorio';
            } else if (key === 'lastRecharge') {
              errorMessage = 'La fecha de recarga es obligatoria';
            }

            productErrors.push({
              field: `productsInOrder[${index}].${key}`,
              message: errorMessage,
            });
          }
        });
      });

      if (productErrors.length >= 0) {
        errors.push({
          productId: product?.id,
          errors: productErrors,
        });
      }
    });

    return errors;
  };

  const customErrors = validateProducts(productsInOrder);

  return (
    <>
      <Formik
        initialValues={{
          clientName: '',
          documentId: '',
          contact: '',
          saleDate: '',
          subTotal: '',
          iva: '',
          name: '',
          barcode: '',
          matricula: '',
          factoryUnit: '',
          unit: '',
          quantity: '',
          lastRecharge: '',
          total: '',
          detail: '',
          managerName: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {}}
      >
        {({ handleChange, values, errors, touched, setFieldValue }) => (
          <KeyboardContainer>
            <Container gap={24} paddingHorizontal={12} paddingVertical={Platform.OS === 'ios' ? 12 : 24} grow={1}>
              <Column gap={12} style={{ backgroundColor: Colors.white }}>
                <TextInput
                  label="Nombre del cliente"
                  onChangeText={handleChange('clientName')}
                  value={selectedOrder?.client.name || values.clientName}
                  error={touched.clientName && errors.clientName ? errors.clientName : ''}
                  editable={!params.id && isEditable ? true : false}
                />
                <TextInput
                  label="R.U.T./ CI"
                  onChangeText={handleChange('documentId')}
                  value={selectedOrder?.client.rut || values.documentId}
                  error={touched.documentId && errors.documentId ? errors.documentId : ''}
                  editable={!params.id && isEditable ? true : false}
                />
                <TouchableOpacity onPress={() => setOpen(true)} disabled={!isEditable}>
                  <Text style={styles.calendar_label}>Fecha de venta</Text>
                  <Row
                    alignItems="center"
                    justifyContent="space-between"
                    style={[styles.calendar_input_container, !isEditable ? styles.calendar_input_disabled : {}]}
                  >
                    <RNTextInput
                      placeholder="DD/MM/YYYY"
                      value={
                        values.saleDate
                          ? dayjs(selectedOrderDate).format('DD/MM/YYYY')
                          : dayjs(selectedOrder?.sellDate).format('DD/MM/YYYY')
                      }
                      editable={false}
                      style={styles.calendar_input}
                    />
                    {!params.id && isEditable && <ArrowDown />}
                  </Row>
                  {touched.saleDate && errors.saleDate && <Text style={styles.input_error_message}>{errors.saleDate}</Text>}
                </TouchableOpacity>
                {isEditable && (
                  <>
                    <CustomSelect
                      data={lists}
                      label="Lista de precios"
                      loading={false}
                      onBlur={() => {}}
                      onChange={(value) => {
                        setSelectedList(value);
                        if (productsInOrder.length) {
                          setPendingState(value);
                          handleChangeList(value.id);
                        }
                      }}
                      placeholder="Seleccione una lista"
                      value={selectedList.id ? selectedList.name : (list?.name ?? '')}
                      showValue
                      canWrite={false}
                      backgroudDisabled={false}
                      onLoadMore={loadMoreLists}
                    />
                    <CustomSelect
                      data={products}
                      label="Detalle"
                      loading={false}
                      onBlur={() => {}}
                      onChange={(value) => {
                        addProductToOrder(value);
                      }}
                      placeholder="Buscar productos..."
                      value=""
                      onLoadMore={loadMoreProducts}
                    />
                  </>
                )}

                <FlatList
                  data={productsInOrder}
                  keyExtractor={(product: Product) => product.id}
                  renderItem={({ item: product, index }) => {
                    return isEditable ? (
                      <>
                        <Flex key={product.id} direction="column" style={styles.card}>
                          <Row justifyContent="space-between" alignItems="center" style={styles.card_container}>
                            <Text fontWeight={600} fontSize={16}>
                              {product.name}
                            </Text>
                            <Cross
                              color={Colors.black}
                              width={24}
                              height={24}
                              onPress={() => setProductsInOrder((prev) => prev.filter((prod) => prod.id !== product.id))}
                            />
                          </Row>
                          <Row justifyContent="space-between" alignItems="center" style={styles.card_content_container}>
                            <Column gap={12} style={styles.card_description} justifyContent="flex-end">
                              <Text textColor={Colors.DARK_GRAY} fontSize={14}>
                                {product.name}
                              </Text>
                              <Text textColor={Colors.DARK_GRAY} fontSize={18}>
                                ${product.fixedPrice}
                              </Text>
                            </Column>
                            <Column gap={12} style={styles.card_description}>
                              <Counter
                                countValue={product.amount || 1}
                                onChange={(value) => updateProductForms(product.id, value)}
                                maxCount={product.stock}
                              />
                              <View style={styles.group}>
                                <Row alignItems="center" gap={8}>
                                  <Text>-</Text>
                                  <RNTextInput
                                    placeholder="0"
                                    value={String(product.discount)}
                                    onChangeText={(value) => {
                                      const numericValue = Math.min(100, Math.max(0, Number(value.replace(/[^0-9]/g, ''))));
                                      updateProductField(product.id, 'discount', numericValue);
                                    }}
                                    keyboardType="number-pad"
                                  />
                                  <Text>%</Text>
                                </Row>
                              </View>
                            </Column>
                          </Row>
                        </Flex>

                        {product?.isToRecharge === 'true' &&
                          product?.productsInOrder?.map((form, index) => {
                            const accordionKey = `${product.id}-${index}`;
                            const title = form.matricula || `Formulario ${index + 1}`;

                            const productErrors = customErrors?.find((e) => e.productId === product.id)?.errors || [];

                            const formErrors = (key: string) => {
                              return productErrors
                                .filter((error) => error.field === `productsInOrder[${index}].${key}`)
                                .map((error) => error.message)
                                .join(', ');
                            };

                            const hasErrors = productErrors.some((error) => error.field.includes(`productsInOrder[${index}]`));

                            return (
                              <Accordion
                                key={accordionKey}
                                isOpen={!!openAccordions[accordionKey]}
                                onToggle={() => toggleAccordion(accordionKey)}
                                onDelete={() => {
                                  handleRemoveForm(product.id, index);
                                }}
                                title={title}
                                height={hasErrors ? 400 : 350}
                                error={hasErrors}
                              >
                                {!barCodeCamera ? (
                                  <Column gap={8}>
                                    <Row justifyContent="space-between">
                                      <TextInput
                                        label="Codigo de barras"
                                        placeholder="Código de barras"
                                        value={form?.barcode}
                                        onChangeText={(value) => updateFormField(product.id, index, 'barcode', value)}
                                        keyboardType="number-pad"
                                        error={formErrors('barcode')}
                                      />
                                      <Pressable style={styles.camera_pressable} onPress={() => setBarCodeCamera(true)}>
                                        <Barcode />
                                      </Pressable>
                                    </Row>
                                    <Row alignItems={errors ? 'flex-start' : 'center'} gap={8}>
                                      <TextInput
                                        label="Matricula"
                                        placeholder="Matrícula"
                                        value={form?.matricula}
                                        onChangeText={(value) => updateFormField(product.id, index, 'matricula', value)}
                                        container={styles.input}
                                        keyboardType="number-pad"
                                        error={formErrors('matricula')}
                                      />
                                      <TextInput
                                        label="N° UNIT de Fabrica"
                                        placeholder="..."
                                        value={form?.factoryUnit}
                                        onChangeText={(value) => updateFormField(product.id, index, 'factoryUnit', value)}
                                        container={styles.input}
                                        error={touched.factoryUnit ? errors.factoryUnit : ''}
                                        keyboardType="number-pad"
                                      />
                                    </Row>
                                    <TextInput
                                      label="N° UNIT"
                                      placeholder="..."
                                      value={form?.unit}
                                      onChangeText={(value) => updateFormField(product.id, index, 'unit', value)}
                                      keyboardType="number-pad"
                                      error={formErrors('unit')}
                                    />
                                    <TouchableOpacity onPress={() => openCalendar(product.id, index)}>
                                      <Text textColor={formErrors('lastRecharge') ? Colors.error : Colors.black}>Fecha de venta</Text>
                                      <Row
                                        alignItems="center"
                                        justifyContent="space-between"
                                        style={[
                                          styles.calendar_input_container,
                                          formErrors('lastRecharge') ? { borderColor: Colors.error } : {},
                                        ]}
                                      >
                                        <RNTextInput
                                          placeholder="DD/MM/YYYY"
                                          value={dayjs(form?.lastRecharge).format('DD/MM/YYYY') || ''}
                                          editable={false}
                                          style={[styles.calendar_input, formErrors('lastRecharge') ? { color: Colors.error } : {}]}
                                        />
                                        <ArrowDown />
                                      </Row>
                                      <Text fontSize={12} fontWeight={300} textColor={Colors.error} style={styles.input_error_message}>
                                        {touched?.lastRecharge && errors?.lastRecharge ? errors?.lastRecharge : ''}
                                      </Text>
                                    </TouchableOpacity>
                                    {productErrors.some((error) => error.field === `productsInOrder[${index}].lastRecharge`) && (
                                      <Text fontSize={12} fontWeight={300} textColor={Colors.error}>
                                        {formErrors('lastRecharge')}
                                      </Text>
                                    )}
                                    {calendarVisible && activeCalendar?.productId === product.id && activeCalendar?.formIndex === index && (
                                      <Calendar
                                        isVisible={calendarVisible}
                                        date={selectedDate || new Date()}
                                        onDateChange={(date) => handleDateChange(date, product.id, index)}
                                        onClose={closeCalendar}
                                      />
                                    )}
                                  </Column>
                                ) : (
                                  <View style={styles.camera}>
                                    <BarCodeScannerComponent
                                      setCode={(scannedCode) => {
                                        updateFormField(product.id, index, 'barcode', scannedCode);
                                        setBarCodeCamera(false);
                                      }}
                                    />
                                  </View>
                                )}
                              </Accordion>
                            );
                          })}
                      </>
                    ) : (
                      <ProductRow isEditable={isEditable} item={product} />
                    );
                  }}
                  contentContainerStyle={{ gap: 8 }}
                />
                <Row gap={8}>
                  <TextInput
                    label="Sub total"
                    editable={false}
                    value={`$${totalPrice?.toFixed(2) || Number(values.subTotal).toFixed(2)}`}
                    onChangeText={handleChange('subTotal')}
                    error={touched.subTotal && errors.subTotal ? errors.subTotal : ''}
                    container={styles.flex_3}
                  />
                  <TextInput
                    label="IVA 22%"
                    editable={false}
                    value={`$${(Number(totalPrice) * 0.22).toFixed(2)}`}
                    onChangeText={handleChange('iva')}
                    error={touched.iva && errors.iva ? errors.iva : ''}
                    container={styles.flex_1}
                  />
                  <TextInput
                    label="Desc."
                    editable={false}
                    value={String(totalDiscount.toFixed(2))}
                    onChangeText={() => {}}
                    container={styles.flex_1}
                    icon={<Text>%</Text>}
                  />
                </Row>
                <TextInput
                  label="Total"
                  editable={false}
                  value={`${total.toFixed(2)}`}
                  onChangeText={handleChange('total')}
                  error={touched.total && errors.total ? errors.total : ''}
                  container={styles.flex_1}
                />
                <CustomSelect
                  data={[{ name: 'Efectivo' }, { name: 'Cheque' }, { name: 'Crédito' }]}
                  label="Forma de pago"
                  loading={false}
                  onBlur={() => {}}
                  onChange={(value) => {
                    const mappedValue = paymentMapping[value?.name] || 'Efectivo';
                    setSelectedPaymentType(mappedValue);
                    setFieldValue('paymentMethod', mappedValue);
                  }}
                  placeholder="Seleccionar forma de pago"
                  value={selectedOrder ? reversePaymentMapping[selectedOrder.paymentType] : ''}
                  canWrite={false}
                  backgroudDisabled={!isEditable}
                  editable={isEditable}
                  showValue
                />
                {selectedOrder?.paymentType === 'CHECK' && isEditable && (
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
                  editable={isEditable}
                  value={managerName || selectedOrder?.clientAuthorize}
                  onChangeText={(value) => setManagerName(value)}
                  error={touched.managerName && errors.managerName ? errors.managerName : ''}
                  container={styles.flex_1}
                />
                {isEditable && (
                  <Row gap={4}>
                    <Checkbox
                      isChecked={isChecked}
                      onPress={() => {
                        setIsChecked(!isChecked);
                      }}
                      fillColor={Colors.SKY_BLUE}
                      disabled={!isEditable}
                    />
                    <Text>Entregado</Text>
                  </Row>
                )}
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
                  <Button
                    onPress={() => {
                      const hasErrors = customErrors.some((error) => error.errors.length > 0);

                      if (!hasErrors) {
                        handleSubmit();
                      }
                    }}
                  >
                    Aceptar
                  </Button>
                </Row>
              )}
            </Container>
          </KeyboardContainer>
        )}
      </Formik>
      <CustomModal
        title={'¡Algo salió mal!'}
        isVisible={error}
        onClose={() => {
          setError(false);
          setShowModal(false);
          router.back();
        }}
        content={<Text>Ocurrió un problema inesperado. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.</Text>}
      />
      <CustomModal
        isVisible={warningModal}
        onClose={() => {
          setWarningModal(false);
          handleModalResponse(false);
        }}
        onConfirm={() => {
          setWarningModal(false);
          handleModalResponse(true);
          setProductsInOrder([]);
        }}
        title="Cambiar lista de precios"
        content={<Text>Al cambiar la lista de precios se eliminarán los productos seleccionados ¿Desea continuar?</Text>}
      />
      {showModal && (
        <ModalSplash
          content={
            <Column gap={32} justifyContent="center" alignItems="center">
              <Text fontSize={24} textColor={Colors.white} fontWeight={700} transform="uppercase">
                {params.id ? 'Cambios guardados' : 'Órden generada'}
              </Text>
              <Image source={params.id ? staticImages.SAVED : staticImages.GENERATE_ORDER} />
              <Text fontSize={14} fontWeight={700} textColor={Colors.white} textAlign="center">
                {params.id ? 'Los cambios realizados se guardaron exitosamente.' : 'La órden fue cargada en el sistema exitosamente.'}
              </Text>

              <Button onPress={() => router.back()} textColor={Colors.RED} backgroundColor={Colors.white}>
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
  wrapper: {
    backgroundColor: Colors.DEFAULT_BACKGROUND,
    flex: 1,
    marginTop: 32,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  orders_header: {
    marginRight: 12,
  },
  orders_header_title: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  budgets_item: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
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
    backgroundColor: Colors.white,
  },
  calendar_input_disabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
  calendar_input: {
    color: Colors.black,
  },
  button_group: {
    paddingHorizontal: 12,
    marginVertical: 32,
    width: '100%',
  },
  flex_3: {
    flex: 2,
  },
  flex_1: {
    flex: 1,
  },
  input_error_message: {
    marginTop: 8,
  },
  product_container: {
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  product: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,

    shadowColor: '#00000020',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 4,
  },
  product_disabled: {
    backgroundColor: '#D9D9D9',
    borderWidth: 0,
  },
  cross: {
    marginRight: 8,
  },
  camera: {
    height: 250,
  },
  input: {
    flex: 1,
  },
  input_bar_code: {
    flex: 0.9,
  },
  card: {
    height: 'auto',
    width: '100%',
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
  card_container: {
    width: '100%',
  },
  card_description: {
    marginTop: 12,
  },
  card_content_container: {
    width: '100%',
  },
  group: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GRAY,
  },
  custom_input: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GRAY,
    textAlign: 'center',
  },
  camera_pressable: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.LIGHT_BLUE,
  },
  input_middle: {
    flex: 0.5,
    marginRight: 8,
  },
  productRowContainer: {
    marginTop: 10,
    gap: 4,
  },
});
