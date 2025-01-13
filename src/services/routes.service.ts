import axiosInstance from '@/axios/axios.config';

interface UserInfo {
  fullName: string;
}

interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string;
  isActive: boolean;
  userInfo: UserInfo;
}

interface SellerRouteResponse {
  totalSellers: [];
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  zone: string;
  isActive: boolean;
  user: User[];
  totalClients: number;
}

interface SellerRouteQueryParams {
  user?: string;
  isActive?: boolean;
  order?: 'ASC' | 'DESC';
  itemsPerPage?: number;
  status?: string;
  page?: number;
  search?: string;
}

interface SellerRoutePaginationResponse {
  total: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
  order: 'ASC' | 'DESC';
}

export interface SellerResponse {
  result: SellerRouteResponse[];
  pagination: SellerRoutePaginationResponse;
}

const SellerRouteService = {
  async createSellerRoute(): Promise<SellerRouteResponse> {
    try {
      const response = await axiosInstance.post<SellerRouteResponse>('/seller-routes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllSellerRoutes(queryParams: SellerRouteQueryParams = {}): Promise<SellerResponse> {
    try {
      const { user, isActive, order, itemsPerPage, page, search } = queryParams;

      const query = new URLSearchParams();
      if (user) query.append('user', user);
      if (isActive !== undefined) query.append('isActive', isActive.toString());
      if (order) query.append('order', order);
      if (itemsPerPage) query.append('itemsPerPage', itemsPerPage.toString());
      if (page !== undefined) query.append('page', page.toString());
      if (search) query.append('search', search);

      const response = await axiosInstance.get<SellerResponse>(`/seller-routes?${query.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSellerRouteById(id: string): Promise<SellerRouteResponse> {
    try {
      const response = await axiosInstance.get<SellerRouteResponse>(`/seller-routes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSellerRoute(id: string, route: string, payload: string): Promise<SellerRouteResponse> {
    try {
      const response = await axiosInstance.put<SellerRouteResponse>(`/seller-routes/update-client/${id}/${route}`, {
        status: payload,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSellerRoute(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/seller-routes/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async updateClientInRoute(id: string, route: string): Promise<SellerRouteResponse> {
    try {
      const response = await axiosInstance.put<SellerRouteResponse>(`/seller-routes/update-client/${id}/${route}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SellerRouteService;
