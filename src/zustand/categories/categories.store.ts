import CategoryRoutesService, { PaginationParams } from '@/services/categories.service';
import { create } from 'zustand';

interface CategoryResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  picture: string;
  totalProducts: number;
}

interface Pagination {
  itemsPerPage: number;
  page: number;
  total: number;
  totalPages: number;
}

interface CategoryStore {
  categories: CategoryResponse[];
  selectedCategory: CategoryResponse | null;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchCategories: (params: PaginationParams, search?: string) => Promise<void>;
  fetchCategoryById: (id: string) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: CategoryResponse | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  pagination: {
    itemsPerPage: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  },
  fetchCategories: async (params: PaginationParams, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await CategoryRoutesService.getCategories(params, search);

      set((state) => ({
        categories: search?.length
          ? response.result
          : [
              ...state.categories,
              ...response.result.filter((newItem) => !state.categories.some((existingItem) => existingItem.id === newItem.id)),
            ],
        pagination: response.pagination,
        currentSearch: search,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: 'Error al obtener las categorías', isLoading: false });
    }
  },

  fetchCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await CategoryRoutesService.getCategoryById(id);
      set({ selectedCategory: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Error al obtener la categoría', isLoading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSelectedCategory: (category: CategoryResponse | null) => {
    set({ selectedCategory: category });
  },
}));
