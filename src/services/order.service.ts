import axiosInstance from '@/axios/axios.config';
import dayjs from 'dayjs';
export interface PaginationParams {
  totalPages: number;
  itemsPerPage: number;
  page: number;
  order?: string;
  total: number;
}

export interface PaginatedOrderResponse {
  result: OrderResponse[];
  pagination: PaginationParams;
}

export interface OrderParams {
  itemsPerPage?: number;
  page: number;
  isPreOrder?: boolean;
  isDirect?: boolean;
  status?: OrderStatus | undefined | string | null;
  order?: 'ASC' | 'DESC';
  reload?: boolean;
}

export enum OrderStatus {
  REQUEST = 'REQUEST',
  PREPARATION = 'PREPARATION',
  READY_PICKUP = 'READY_PICKUP',
  EGRESS = 'EGRESS',
  DELIVERED = 'DELIVERED',
  PREORDER = 'PREORDER',
}

export enum PaymentType {
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  CHECK = 'CHECK',
}

export interface PayCheck {
  number: string;
  amount: string;
}

export interface ProductInOrder {
  stock: number;
  isRecharge: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fixedPrice: number;
  amount: number;
  discountPercent: number;
  isToRecharge: string;
  product: Product;
  itemsRemoval: ItemRemoval[];
  name: string;
  type: string;
}

export interface ItemRemoval {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  barCode: string;
  enrollment: string;
  lastDate: string | null;
  testDate: string | null;
  numberUNIT: string;
  newUNIT: string;
  fabricUNIT: string;
  capacity: string;
  pressure: string;
  expansion: string;
  color: string;
}

export interface Product {
  isToRecharge: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code: string;
  name: string;
  description: string;
  type: string;
  amount: string;
  unit: string;
  stock: number;
  minStock: number;
  isAvailable: boolean;
  isSellWithoutStock: boolean;
  ivaPercent: number;
  picture: string;
}

export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  managerName: string | null;
  department: string;
  neighborhood: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  alternativePhones: string[];
  rut: string;
  ci: string;
  status: string;
  competenceName: string;
  nextVisit: string | null;
  latitude: number | null;
  longitude: number | null;
  isOneTime: boolean;
}

export interface UserInfo {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fullName: string;
  profilePic: string | null;
  phone: string;
  ci: string;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string;
  isActive: boolean;
  userInfo: UserInfo;
}

export interface OrderResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: OrderStatus;
  paymentType: PaymentType;
  discountPercent: number;
  isDirect: boolean;
  isPreOrder: boolean;
  isDelivered: boolean;
  sellDate: string;
  payDate: string | null;
  dueDate: string | null;
  billNumber: string;
  payCheck?: string;
  authorization: boolean;
  productInOrder: ProductInOrder[];
  client: Client;
  user: User;
  clientAuthorize: string;
  listId: string;
  stock: number;
}

export interface OrderPayload {
  status: OrderStatus;
  paymentType: PaymentType | null;
  isDelivered: boolean;
  discountPercent: number;
  isDirect: boolean;
  isPreOrder: boolean;
  sellDate: Date | dayjs.Dayjs | null | string;
  payDate: Date | dayjs.Dayjs | null | string;
  dueDate: Date | dayjs.Dayjs | null | string;
  payCheck?: string;
  productInOrder: {
    fixedPrice: string | number;
    amount: string | number;
    isRecharge: boolean | string;
    discountPercent: string | number;
    product: { id: string };
    ItemsRemoval?: {
      barCode: string;
      enrollment: string;
      lastDate: string;
      numberUNIT: string;
      capacity: string;
    }[];
  }[];
  client: {
    id?: string;
    name?: string;
    phone?: string | null;
    rut?: string;
    status?: string;
    isOneTime?: boolean;
  };
  user: {
    id: string;
  };
}

const OrderService = {
  async createOrder(orderData: OrderPayload): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.post<OrderResponse>('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOrders(user: string, params: OrderParams, search: string): Promise<PaginatedOrderResponse> {
    try {
      const { itemsPerPage, page, order = 'ASC', isPreOrder, isDirect, status } = params;

      const query = new URLSearchParams({
        itemsPerPage: itemsPerPage?.toString() ?? '',
        page: page?.toString(),
        order,
        user,
        ...(search ? { search } : {}),
        ...(isPreOrder !== undefined ? { isPreOrder: isPreOrder.toString() } : {}),
        ...(isDirect !== undefined ? { isDirect: isDirect.toString() } : {}),
        ...(status ? { status } : {}),
      }).toString();

      const response = await axiosInstance.get<PaginatedOrderResponse>(`/orders?${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.get<OrderResponse>(`/orders/one/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by id:', error);
      throw error;
    }
  },

  async updateOrder(id: string, updatedOrderData: Partial<OrderPayload>): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.put<OrderResponse>(`/orders/${id}`, updatedOrderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteOrder(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/orders/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Descargar las órdenes como archivo XLSX
  async downloadOrdersXlsx(): Promise<void> {
    try {
      const response = await axiosInstance.get('/orders/xlsx', {
        responseType: 'blob',
      });

      // Crear un enlace temporal para la descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      throw error;
    }
  },
};

export default OrderService;
