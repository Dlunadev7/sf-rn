import { create } from 'zustand';
import OrderService, { OrderPayload, OrderResponse, OrderParams, PaginatedOrderResponse } from '@/services/order.service';
import UserStorageService from '../user/user.storage';

interface OrderStoreState {
  orders: PaginatedOrderResponse;
  selectedOrder: OrderResponse | null;
  loading: boolean;
  error: string | null;
  directOrders: PaginatedOrderResponse;
  preOrders: PaginatedOrderResponse;
  createOrder: (orderData: OrderPayload) => Promise<OrderResponse | undefined | unknown>;
  fetchOrders: (params: OrderParams, search: string) => Promise<void>;
  fetchDirectOrders: (params: OrderParams, search: string) => Promise<void>;
  fetchPreOrders: (params: OrderParams, search: string) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrder: (id: string, updatedOrderData: Partial<OrderPayload>) => Promise<OrderResponse | undefined | unknown>;
  deleteOrder: (id: string) => Promise<void>;
  downloadOrdersXlsx: () => Promise<void>;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStoreState>((set) => ({
  orders: {
    result: [],
    pagination: {
      page: 1,
      itemsPerPage: 10,
      total: 0,
      totalPages: 0,
    },
  },
  selectedOrder: null,
  loading: false,
  error: null,
  directOrders: {
    result: [],
    pagination: {
      page: 1,
      itemsPerPage: 10,
      total: 0,
      totalPages: 0,
    },
  },
  preOrders: {
    result: [],
    pagination: {
      page: 1,
      itemsPerPage: 10,
      total: 0,
      totalPages: 0,
    },
  },
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.createOrder(orderData);
      return response;
    } catch (error) {
      set({ error: 'Error creating order' });
      return error;
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async (params, search) => {
    set({ loading: true, error: null });
    try {
      const userId = await UserStorageService.getItem('id');

      const orders = await OrderService.getOrders(userId!, { ...params, isPreOrder: false, isDirect: false }, search);

      set((state) => ({
        orders: {
          result:
            params.page !== 0
              ? [
                  ...state.orders.result,
                  ...orders.result.filter((newItem) => !state.orders.result.some((existingItem) => existingItem.id === newItem.id)),
                ]
              : orders.result,
          pagination: orders.pagination,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error fetching orders' });
    } finally {
      set({ loading: false });
    }
  },

  fetchDirectOrders: async (params, search) => {
    set({ loading: true, error: null });
    try {
      const userId = await UserStorageService.getItem('id');

      const orders = await OrderService.getOrders(userId!, params, search);
      set((state) => ({
        directOrders:
          params.page !== 0
            ? {
                result: [
                  ...state.directOrders.result,
                  ...orders.result.filter((newItem) => !state.directOrders.result.some((existingItem) => existingItem.id === newItem.id)),
                ],
                pagination: orders.pagination,
              }
            : orders,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error fetching direct orders' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPreOrders: async (params, search) => {
    set({ loading: true, error: null });
    try {
      const userId = await UserStorageService.getItem('id');

      const orders = await OrderService.getOrders(userId!, params, search);

      set((state) => ({
        preOrders:
          params.page !== 0
            ? {
                result: [
                  ...state.preOrders.result,
                  ...orders.result.filter((newItem) => !state.orders.result.some((existingItem) => existingItem.id === newItem.id)),
                ],
                pagination: orders.pagination,
              }
            : orders,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error fetching orders' });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const order = await OrderService.getOrderById(id);
      set({ selectedOrder: order });
    } catch (error) {
      set({ error: 'Error fetching order by id' });
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id, updatedOrderData) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.updateOrder(id, updatedOrderData);
      return response;
    } catch (error) {
      set({ error: 'Error updating order' });
      throw Error('Ha ocurrido un error');
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await OrderService.deleteOrder(id);
    } catch (error) {
      set({ error: 'Error deleting order' });
    } finally {
      set({ loading: false });
    }
  },

  downloadOrdersXlsx: async () => {
    set({ loading: true, error: null });
    try {
      await OrderService.downloadOrdersXlsx();
    } catch (error) {
      set({ error: 'Error downloading orders XLSX' });
    } finally {
      set({ loading: false });
    }
  },

  clearOrder: () => {
    set({ selectedOrder: null });
  },
}));
