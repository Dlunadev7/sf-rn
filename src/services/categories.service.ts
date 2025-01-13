import axiosInstance from '@/axios/axios.config';

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

export interface PaginationParams {
  itemsPerPage: number;
  page: number;
  order?: string;
}

interface PaginatedCategoryResponse {
  pagination: {
    itemsPerPage: number;
    order: string;
    page: number;
    total: number;
    totalPages: number;
  };
  result: CategoryResponse[];
}

const CategoryRoutesService = {
  async getCategories(params: PaginationParams, search?: string): Promise<PaginatedCategoryResponse> {
    const { itemsPerPage, page, order = 'asc' } = params;

    const query = new URLSearchParams({
      itemsPerPage: itemsPerPage.toString(),
      page: page.toString(),
      order,
      ...(search && { search }),
    }).toString();

    const response = await axiosInstance.get<PaginatedCategoryResponse>(`/product-category?${query}`);
    return response.data;
  },

  async getCategoryById(id: string) {
    return axiosInstance.get<CategoryResponse>(`/product-category/${id}`);
  },
};

export default CategoryRoutesService;
