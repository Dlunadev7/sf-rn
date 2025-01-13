import ProductService, {
  PaginatedProductResponse,
  PaginationParams,
  ProductListResponse,
  ProductResponse,
} from '@/services/product.services';
import { create } from 'zustand';

interface ProductStore {
  products: ProductResponse[];
  product: ProductResponse | null;
  pagination: {
    product: PaginatedProductResponse['pagination'];
    lists: PaginatedProductResponse['pagination'];
  };
  isLoading: boolean;
  error: string | null;
  lists: (ProductResponse | ProductListResponse)[];
  list: ProductListResponse | null;
  fetchProducts: (params: PaginationParams, search?: string, paginate?: boolean) => Promise<void>;
  fetchProductById: (id: string) => Promise<ProductResponse | null>;
  downloadProductsXlsx: () => Promise<void>;
  fetchAllList: (params: PaginationParams, search?: string) => Promise<void>;
  fetchListById: (id: string) => Promise<void>;
  clearLists: () => void;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  pagination: {
    product: {
      page: 0,
      itemsPerPage: 0,
      totalPages: 0,
      total: 0,
    },
    lists: {
      page: 0,
      itemsPerPage: 0,
      totalPages: 0,
      total: 0,
    },
  },
  isLoading: false,
  error: null,
  product: null,
  lists: [],
  list: null,
  fetchProducts: async (params, search, paginate = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ProductService.getProducts(params, search);
      set((state) => ({
        products:
          paginate && search?.length
            ? [
                ...state.products,
                ...response.result.filter((newItem) => !state.products.some((existingItem) => existingItem.id === newItem.id)),
              ]
            : response.result,
        pagination: {
          ...state.pagination,
          product: response.pagination,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Error al obtener productos', isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await ProductService.getProductById(id);
      set({ isLoading: false, product });
      return product;
    } catch (error) {
      set({ error: 'Error al obtener el producto', isLoading: false });
      return null;
    }
  },

  downloadProductsXlsx: async () => {
    try {
      await ProductService.downloadProductsXlsx();
    } catch (error) {
      set({ error: 'Error al descargar productos en XLSX' });
    }
  },

  fetchAllList: async (params: PaginationParams, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ProductService.fetchProductList(params, search);

      const result = Array.isArray(response.result) ? response.result : [response.result];

      set((state) => ({
        lists: search
          ? result
          : [...state.lists, ...result.filter((newItem) => !state.lists.some((existingItem) => existingItem.id === newItem.id))],
        pagination: {
          ...state.pagination,
          lists: response.pagination,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Error al obtener la lista de productos', isLoading: false });
    }
  },

  fetchListById: async (id: string) => {
    try {
      const response = await ProductService.fetchProductsListById(id);
      set({ list: response });
    } catch (error) {
      set({ error: 'Error al obtener la lista de productos por ID' });
    }
  },

  clearLists: () => {
    set({ lists: [] });
  },
}));

export default useProductStore;
