import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, TouchableOpacity, View, TextInput as RNTextInput } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import { Calendar } from '@/components/commons/calendar/calendar.component';
import { CustomSelect } from '@/components/commons/custom-select/custom-select.component';
import BarCodeScannerComponent from '@/components/commons/camera/camera.component';
import {
  Accordion,
  Button,
  Column,
  Container,
  Counter,
  Flex,
  Row,
  Text,
  TextInput,
  KeyboardContainer,
  CustomModal,
} from '@/components/commons';
import { ArrowDown, ArrowLeftFilled, Barcode, Cross } from '../../../assets/svg';
import useProductStore from '@/zustand/products/products.store';
import { Colors } from '@/utils';
import { ButtonType } from '@/utils/types/button.type';
import { PaginationParams } from '@/services/product.services';
import { styles } from '@/styles/sales/sales.styles';
import { router, useNavigation } from 'expo-router';
import { SalesRoutesLink } from '@/utils/routes/sales.routes';
import dayjs from 'dayjs';
import { Header } from '@/components/headers';

const ItemSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  quantity: Yup.number().optional(),
  lastRecharge: Yup.date().required('La fecha es obligatoria'),
  selectedList: Yup.object()
    .shape({
      id: Yup.string().required('La lista de precios es obligatoria'),
      name: Yup.string().required('El nombre de la lista es obligatorio'),
    })
    .nullable()
    .when('productsInOrder', {
      is: (productsInOrder: []) => !productsInOrder || productsInOrder.length === 0,
      then: (schema) => schema.required('Debe seleccionar una lista de precios'),
      otherwise: (schema) => schema.nullable(),
    }),
  selectedDetail: Yup.object()
    .shape({
      id: Yup.string().required('El detalle del producto es obligatorio'),
      name: Yup.string().required('El nombre del producto es obligatorio'),
    })
    .nullable()
    .when('productsInOrder', {
      is: (productsInOrder: []) => !productsInOrder || productsInOrder.length === 0,
      then: (schema) => schema.required('Debe seleccionar un detalle de producto'),
      otherwise: (schema) => schema.nullable(),
    }),
  productsInOrder: Yup.array().of(
    Yup.object().shape({
      barcode: Yup.string().required('El código de barras es obligatorio'),
      matricula: Yup.string().required('La matrícula es obligatoria'),
      factoryUnit: Yup.string().optional(),
      unit: Yup.string().required('El número UNIT es obligatorio'),
    }),
  ),
});

export type SelectValuesProps = {
  name: string;
  list?: {
    price: number;
  }[];
  id: string;
  type?: string;
  stock?: number;
};

export interface Discounts {
  [key: string]: string;
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
  id: string;
  name: string;
  amount: number;
  fixedPrice: number;
  discount: number;
  type: string;
  productsInOrder: ProductForm[];
  list?: ProductList[];
  isRecharge: string;
}

interface OpenAccordionsState {
  [key: string]: boolean;
}

interface ActiveCalendar {
  productId: string | null;
  formIndex: number | null;
}

export type ValidationError = {
  productId: string;
  errors: { field: string; message: string }[];
};

export default function SalesDetail() {
  const formRef = useRef<FormikProps<{
    name: string;
    barcode: string;
    matricula: string;
    factoryUnit: string;
    unit: string;
    lastRecharge: string;
    selectedList: null;
    selectedDetail: null;
  }> | null>(null);
  const { params } = useRoute<RouteProp<{ params: { clientID: string; saleDate: string; isDirect: string } }>>();

  const [barCodeCamera, setBarCodeCamera] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<ActiveCalendar | null>({ productId: null, formIndex: null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openAccordions, setOpenAccordions] = useState<OpenAccordionsState>({});
  const [warningModal, setWarningModal] = useState(false);
  const [productsInOrder, setProductsInOrder] = useState<Product[]>([]);
  const [pendingState, setPendingState] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageProducts, setCurrentPageProducts] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigator = useNavigation();
  const itemsPerPage = 10;

  const [selectedList, setSelectedList] = useState<{ id: string; name: string }>({ id: '', name: '' });

  const { lists, products, fetchAllList, fetchProducts, pagination } = useProductStore();

  const addProductToOrder = (product: Partial<Product & { isToRecharge: string }>): void => {
    const newProduct: Product = {
      id: product.id || '',
      name: product.name || '',
      fixedPrice: product?.list?.[0]?.price ?? 0,
      amount: 1,
      discount: 0,
      type: product.type || '',
      isRecharge: product.isToRecharge || 'false',
      productsInOrder:
        product.isToRecharge === 'true'
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
    };

    setProductsInOrder((prev: Product[]) => [...prev, newProduct]);
  };

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
                product.isRecharge === 'false'
                  ? []
                  : Array.from(
                      { length: quantity },
                      (_, i) =>
                        product.productsInOrder?.[i] || {
                          barcode: '',
                          matricula: '',
                          factoryUnit: '',
                          unit: '',
                          lastRecharge: null,
                        },
                    ),
            }
          : product,
      ),
    );
  };

  const updateFormField = (productId: string, formIndex: number, field: string, value: string | Date): void => {
    setProductsInOrder((prev: Product[]) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              productsInOrder:
                product.isRecharge === 'false'
                  ? []
                  : product.productsInOrder?.map((form, index) => (index === formIndex ? { ...form, [field]: value } : form)),
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
    updateFormField(productId, formIndex, 'lastRecharge', date);
    setSelectedDate(date);
    closeCalendar();
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

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: itemsPerPage,
      order: 'ASC',
      category: '',
      clientID: params.clientID,
      isDirect: Boolean(params.isDirect) ? true : false,
    };
    (async () => fetchAllList(paginationParams))();
  }, [currentPage, fetchAllList, itemsPerPage, params.clientID, params.isDirect]);

  console.log(products);

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: currentPageProducts,
      itemsPerPage: itemsPerPage,
      order: 'ASC',
      category: '',
      list: selectedList.id,
    };
    if (selectedList.id) {
      fetchProducts(paginationParams, '', false);
    }
  }, [selectedList.id, fetchProducts, currentPageProducts, itemsPerPage]);

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
          isDirect: Boolean(params.isDirect) ? true : false,
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
        },
        '',
      );
      return nextPage;
    });
  };

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

  useEffect(() => {
    navigator.setOptions({
      header: () => <Header onBackPress={() => router.back()} showArrow title="Nueva Venta" background={Colors.white} />,
    });
  }, [navigator]);

  const validateProducts = (products: Product[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!Boolean(selectedList.id) || productsInOrder.length <= 0) {
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
    <KeyboardContainer keyboardShouldPersistTaps="handled">
      <Container gap={24} paddingHorizontal={12} paddingVertical={Platform.OS === 'ios' ? 12 : 24} grow={1}>
        <Text fontSize={18} fontWeight={500}>
          2. Detalle de la Venta
        </Text>

        <Formik
          innerRef={formRef}
          initialValues={{
            name: '',
            barcode: '',
            matricula: '',
            factoryUnit: '',
            unit: '',
            lastRecharge: '',
            selectedList: null,
            selectedDetail: null,
          }}
          validationSchema={ItemSchema}
          onSubmit={() => {}}
        >
          {({ errors, touched, setTouched, setFieldValue }) => {
            return (
              <Column gap={8}>
                <CustomSelect
                  data={lists}
                  label="Lista de precios"
                  loading={false}
                  onBlur={() => {}}
                  onChange={(value) => {
                    if (value) {
                      setSelectedList(value);
                      if (productsInOrder.length) {
                        setPendingState(value);
                        handleChangeList(value.id);
                      }
                      setTouched({
                        ...touched,
                        selectedList: false,
                      });
                    }
                  }}
                  placeholder="Seleccione una lista"
                  value=""
                  showValue
                  canWrite={false}
                  backgroudDisabled={false}
                  onLoadMore={loadMoreLists}
                  error={touched.selectedList ? errors.selectedList : ''}
                  emptyText="No hay listas asignadas al cliente"
                />
                <CustomSelect
                  data={params.isDirect ? products?.filter((product) => product.isToRecharge === 'false') : products}
                  label="Detalle"
                  loading={false}
                  onBlur={() => {}}
                  onChange={(value) => {
                    if (value) {
                      addProductToOrder(value);
                      setTouched({
                        ...touched,
                        selectedDetail: false,
                      });
                    }
                  }}
                  placeholder="Buscar productos..."
                  value=""
                  onLoadMore={loadMoreProducts}
                  error={touched.selectedDetail ? errors.selectedDetail : ''}
                  editable={!!selectedList.id}
                  emptyText="No hay productos asignados a la lista!"
                />
                {productsInOrder.length <= 0 ? (
                  <Text fontSize={12}>Por favor, selecciona al menos un producto para poder continuar.</Text>
                ) : (
                  <Text></Text>
                )}
                {productsInOrder.map((product) => (
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
                          onPress={() => setProductsInOrder((prev) => prev?.filter((prod) => prod.id !== product.id))}
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
                          <Counter countValue={product.amount || 1} onChange={(value) => updateProductForms(product.id, value)} />
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

                    {product?.isRecharge === 'true' ? (
                      product?.productsInOrder?.map((form, index) => {
                        const accordionKey = `${product.id}-${index}`;
                        const title = form.matricula || `Formulario ${index + 1}`;

                        const productErrors = customErrors?.find((e) => e.productId === product.id)?.errors || [];

                        const formErrors = (key: string) => {
                          return productErrors
                            ?.filter((error) => error.field === `productsInOrder[${index}].${key}`)
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
                                    value={form.barcode}
                                    onChangeText={(value) => {
                                      updateFormField(product.id, index, 'barcode', value);
                                    }}
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
                                    value={form.matricula}
                                    onChangeText={(value) => {
                                      updateFormField(product.id, index, 'matricula', value);
                                    }}
                                    container={styles.input}
                                    keyboardType="number-pad"
                                    error={formErrors('matricula')}
                                  />
                                  <TextInput
                                    label="N° UNIT de Fabrica"
                                    placeholder="..."
                                    value={form.factoryUnit}
                                    onChangeText={(value) => {
                                      updateFormField(product.id, index, 'factoryUnit', value);
                                    }}
                                    container={styles.input}
                                    keyboardType="number-pad"
                                  />
                                </Row>
                                <TextInput
                                  label="N° UNIT"
                                  placeholder="..."
                                  value={form.unit}
                                  onChangeText={(value) => {
                                    updateFormField(product.id, index, 'unit', value);
                                  }}
                                  keyboardType="number-pad"
                                  error={formErrors('unit')}
                                />
                                <TouchableOpacity onPress={() => openCalendar(product.id, index)}>
                                  <Column gap={8}>
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
                                        value={dayjs(form.lastRecharge).format('DD/MM/YYYY') || ''}
                                        editable={false}
                                        style={[styles.calendar_input, formErrors('lastRecharge') ? { color: Colors.error } : {}]}
                                      />

                                      <ArrowDown />
                                    </Row>
                                  </Column>
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
                                    onDateChange={(date) => {
                                      handleDateChange(date, product.id, index);
                                    }}
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
                      })
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </Column>
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
            setProductsInOrder([]);
          }}
          title="Cambiar lista de precios"
          content={<Text>Al cambiar la lista de precios se eliminarán los productos seleccionados ¿Desea continuar?</Text>}
        />
      </Container>
      <Row style={styles.button_group} justifyContent="space-between">
        <Button onPress={() => router.back()} type={ButtonType.TEXT} leftIcon={<ArrowLeftFilled color={Colors.black} />}>
          Volver
        </Button>
        <Button
          onPress={() => {
            const hasErrors = customErrors.some((error) => error.errors.length > 0);

            if (!hasErrors && productsInOrder.length > 0) {
              router.push({
                pathname: SalesRoutesLink.SALES_PAYMENT,
                params: {
                  selectedDetails: JSON.stringify(productsInOrder),
                  isDirect: params.isDirect,
                  clientID: params.clientID,
                  saleDate: params.saleDate,
                  listID: selectedList.id,
                },
              });
            }
          }}
          shadow={false}
        >
          Siguiente
        </Button>
      </Row>
      <CustomModal
        title="Ha ocurrido un error"
        content={<Text>Los formularios deben completarse para poder avanzar</Text>}
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </KeyboardContainer>
  );
}
