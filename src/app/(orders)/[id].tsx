import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Colors } from '@/utils';
import { Edit } from '../../../assets/svg';
import dayjs from 'dayjs';

import { useRoute } from '@react-navigation/native';
import { useOrderStore } from '@/zustand/order/order.store';
import { Header } from '@/components/headers';
import { router, useNavigation } from 'expo-router';
import useProductStore from '@/zustand/products/products.store';
import { Order, PaginationParams } from '@/services/product.services';
import { Discounts, SelectValuesProps } from '../(sales)/sales_detail';
import BudgetForm from '@/components/forms/budget.form';
import { useClientStore } from '@/zustand/client/client.store';

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
export default function Budget() {
  const navigator = useNavigation();
  const params = useRoute().params as { name: string; budgetId: string; clientID: string };
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { selectedOrder, fetchOrderById, clearOrder } = useOrderStore();
  const [showSplashModal, setShowSplashModal] = useState(false);

  const [selectedItems, setSelectedDetails] = useState<CustomSelectedDetail[]>(
    selectedOrder?.productInOrder?.map((item) => ({
      ...item,
      id: item.product.id,
      title: item.product.name,
      fixedPrice: item.fixedPrice,
      amount: String(item.amount),
      discountPercent: item.discountPercent,
      type: item.product.type,
      reload: false,
      stock: item.product.stock,
    })) || [],
  );

  const { client, getClientById, clearClient, getClients, clients } = useClientStore();

  const [isEditable, setIsEditable] = useState(!params?.budgetId);
  const [selectedList, setSelectedList] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  const [currentPage] = useState(0);
  const [currentPageProducts, setCurrentPageProducts] = useState(0);
  const [isChecked, setIsChecked] = useState<boolean | null>(null);

  const { products, lists, fetchProducts, fetchAllList, clearLists, pagination } = useProductStore();

  const listsMapped = lists.map((item) => item);
  const productsMapped = products.map((item) => item);

  const itemsPerPage = 10;

  const handleSelectChange = (
    value: SelectValuesProps & { value?: string },
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void,
    values: { discountPercent: Discounts },
  ) => {
    if (!value.id) return;

    console.log(value);

    setSelectedDetails((prevDetails) => {
      const existingIndex = prevDetails.findIndex((detail) => detail.id === value.id);

      const discountPercent = Number(values.discountPercent[value.id] ?? 0);
      const originalPrice = value.list?.[0]?.price ?? 0;
      const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
      const amount = value.value ? String(Number(value.value)) : '0';

      if (existingIndex !== -1) {
        const updatedDetails = [...prevDetails];
        updatedDetails[existingIndex] = {
          ...updatedDetails[existingIndex],
          amount,
          discountPercent,
        };
        return updatedDetails;
      }

      console.log(value.value);

      const newDetail: CustomSelectedDetail = {
        id: value.id,
        title: value.name ?? 'Producto sin nombre',
        fixedPrice: discountedPrice,
        discountPercent,
        type: value.type || '',
        reload: false,
        stock: value.stock || 0,
        amount,
        product: {
          id: value.id,
        },
      };

      console.log(newDetail);

      return [...prevDetails, newDetail];
    });
  };

  const handleDiscountChange = (
    text: string,
    id: string,
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void,
  ) => {
    const discount = Number(text) || 0;

    setFieldValue(`discountPercent.${id}`, String(discount));

    setSelectedDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.id === id
          ? {
              ...detail,
              discountPercent: discount,
              fixedPrice: detail.fixedPrice,
              amount: detail.amount,
            }
          : detail,
      ),
    );
  };

  useEffect(() => {
    const clientIDToUse = params.clientID || client?.id;

    if (isChecked && !client) {
      const paginationParams: PaginationParams = {
        page: currentPage,
        itemsPerPage: itemsPerPage,
        order: 'ASC',
        category: '',
      };

      fetchAllList(paginationParams);
    } else {
      clearLists();
    }

    if (!clientIDToUse && !client) {
      console.warn('No hay un clientID válido para usar');
      return;
    }

    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: itemsPerPage,
      order: 'ASC',
      category: '',
      clientID: clientIDToUse,
    };

    fetchAllList(paginationParams);

    return () => clearLists();
  }, [clearLists, client, currentPage, fetchAllList, isChecked, params.clientID]);

  useEffect(() => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: itemsPerPage,
      order: 'ASC',
      category: '',
      list: selectedList.id,
    };
    if (selectedList.id) {
      fetchProducts(paginationParams, '', false);
    }
  }, [selectedList.id, fetchProducts, currentPage]);

  const onDateChange = (date: Date, setFieldValue: (field: string, value: unknown) => void) => {
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    setSelectedDate(formattedDate);
    setFieldValue('saleDate', date);
    setOpen(false);
  };

  useEffect(() => {
    const loadData = async () => {
      if (params?.budgetId) {
        await fetchOrderById(params.budgetId);
      }
    };

    loadData();

    return () => {
      setSelectedDetails([]);
    };
  }, [clearClient, fetchOrderById, params.budgetId, params.clientID]);

  useEffect(() => {
    navigator.setOptions({
      header: () =>
        !showSplashModal && (
          <Header
            title={params?.name ?? 'Nuevo presupuesto'}
            showArrow
            rightIcon={
              params.budgetId &&
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
  }, [params.budgetId, navigator, params?.name, isEditable, showSplashModal]);

  const removeItem = (id: string) => {
    setSelectedDetails((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (!params.budgetId) {
      setSelectedDetails([]);
    }
    return () => {
      setSelectedDetails([]);
    };
  }, [params.budgetId, params.clientID]);

  useEffect(() => {
    if (selectedOrder?.productInOrder) {
      const updatedDetails = selectedOrder.productInOrder.map((item) => ({
        ...item,
        id: item.product.id,
        title: item.product.name,
        fixedPrice: item.fixedPrice,
        amount: String(item.amount),
        discountPercent: item.discountPercent,
        type: item.product.type,
        reload: false,
        stock: item.product.stock,
      }));
      setSelectedDetails(updatedDetails);
    }
  }, [selectedOrder]);

  useEffect(() => {
    const fetchClientData = async () => {
      if (params.clientID) {
        await getClientById(params.clientID);
      }
    };

    fetchClientData();
    clearOrder();
    setSelectedDetails([]);
  }, [clearOrder, getClientById, params.clientID]);

  useEffect(() => {
    (async () => await getClients())();
  }, [getClients]);

  const loadMoreLists = useCallback(async () => {
    const paginationParams: PaginationParams = {
      page: currentPage,
      itemsPerPage: 10,
      order: Order.DESC,
      category: '',
    };

    await fetchAllList(paginationParams);
  }, [currentPage, fetchAllList]);

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
        true,
      );
      return nextPage;
    });
  };

  return (
    <BudgetForm
      selectedDetails={selectedItems}
      listsMapped={listsMapped}
      productsMapped={productsMapped}
      isEditable={isEditable}
      onDateChange={onDateChange}
      open={open}
      setOpen={setOpen}
      setSelectedList={setSelectedList}
      handleSelectChange={handleSelectChange}
      params={params}
      selectedDate={selectedDate}
      removeItem={removeItem}
      handleDiscountChange={handleDiscountChange}
      client={client}
      setSelectedDetails={setSelectedDetails}
      selectedList={selectedList}
      clients={clients}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
      loadMoreLists={loadMoreLists}
      loadMoreProducts={loadMoreProducts}
      showSplashModal={showSplashModal}
      setShowSplashModal={setShowSplashModal}
    />
  );
}
