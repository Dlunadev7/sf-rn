import axiosInstance from '@/axios/axios.config';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export interface PaginationParams {
  itemsPerPage: number;
  page: number;
  order: 'ASC' | 'DESC';
  list?: string;
  category: string;
  clientID?: string;
  isDirect?: boolean;
}

export interface PaginatedProductResponse {
  pagination: {
    itemsPerPage: number;
    page: number;
    total: number;
    totalPages: number;
  };
  result: ProductResponse[];
}

interface Category {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  picture: string;
}

interface PriceList {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  price: number;
  list: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    name: string;
    isDirect: boolean;
  } | null;
}

export interface ProductResponse {
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
  category: Category;
  list: PriceList[];
  isDirect: boolean;
}

export interface ProductListResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  picture: string;
  products: ProductResponse[];
  isDirect: boolean;
}

const ProductService = {
  async getProducts(params: PaginationParams, search?: string): Promise<PaginatedProductResponse> {
    try {
      const { itemsPerPage, page, order = 'ASC', category, list } = params;

      const query = new URLSearchParams({
        itemsPerPage: itemsPerPage.toString(),
        page: page.toString(),
        order,
        category,
        ...(list ? { list } : {}),
        ...(search ? { search } : {}),
      }).toString();

      const response = await axiosInstance.get<PaginatedProductResponse>(`/products?${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.get<ProductResponse>(`/products/one/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Descarga productos en formato XLSX
  async downloadProductsXlsx(): Promise<Blob> {
    try {
      const response = await axiosInstance.get('/products/xlsx', {
        responseType: 'blob', // Esto asegura que el archivo se descargue como blob
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async fetchProductList(params: PaginationParams, search?: string): Promise<PaginatedProductResponse> {
    try {
      const { itemsPerPage, page, order = 'DESC', category, clientID, isDirect } = params;

      const query = new URLSearchParams({
        order,
        itemsPerPage: itemsPerPage.toString(),
        page: page.toString(),
        ...(isDirect ? { isDirect: isDirect.toString() } : {}),
        ...(clientID ? { client: clientID } : {}),
        ...(category ? { category } : {}),
        ...(search ? { search } : {}),
      }).toString();

      const response = await axiosInstance.get<PaginatedProductResponse>(`/product-list?${query}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async fetchProductsListById(id: string): Promise<ProductListResponse> {
    try {
      const response = await axiosInstance.get(`/product-list/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductService;
