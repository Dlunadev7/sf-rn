import { create } from 'zustand';
import { AxiosError } from 'axios';
import SellerRouteService, { SellerResponse } from '@/services/routes.service';

interface UserInfo {
  fullName: string;
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

interface Route {
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

interface RouteState {
  routes: SellerResponse;
  route: Route | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterByStatus: string;
  getRoutes: (user?: string, page?: number, search?: string, status?: string) => Promise<void>;
  getRouteById: (id: string) => Promise<void>;
  createRoute: (route: Route) => Promise<void>;
  updateRoute: (id: string, route: string, payload: string) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setFilterByStatus: (status: string) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  routes: {
    result: [],
    pagination: {
      total: 0,
      page: 0,
      totalPages: 0,
      itemsPerPage: 0,
      order: 'ASC',
      search: '',
    },
  },
  route: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterByStatus: '',

  getRoutes: async (user, page = 0, search = '', status = '') => {
    set({ loading: true, error: null });
    try {
      const response = await SellerRouteService.getAllSellerRoutes({
        user,
        page,
        search,
        status,
        order: 'ASC',
        itemsPerPage: 10,
        isActive: true,
      });

      set((state) => ({
        routes: {
          result: page === 0 ? response.result : [...(state.routes?.result || []), ...response.result],
          pagination: response.pagination,
        },
        loading: false,
      }));
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Error al obtener las rutas';
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: 'Error desconocido al obtener las rutas',
          loading: false,
        });
      }
    }
  },

  getRouteById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await SellerRouteService.getSellerRouteById(id);
      set({ route: response, loading: false });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Error al obtener la ruta';
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: 'Error desconocido al obtener la ruta',
          loading: false,
        });
      }
    }
  },

  createRoute: async (route: Route) => {
    set({ loading: true, error: null });
    try {
      await SellerRouteService.createSellerRoute();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Error al crear la ruta';
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: 'Error desconocido al crear la ruta',
          loading: false,
        });
      }
    }
  },

  updateRoute: async (id: string, route: string, payload: string) => {
    set({ loading: true, error: null });
    try {
      await SellerRouteService.updateSellerRoute(id, route, payload);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar la ruta';
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: 'Error desconocido al actualizar la ruta',
          loading: false,
        });
      }
    }
  },

  deleteRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await SellerRouteService.deleteSellerRoute(id);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Error al eliminar la ruta';
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: 'Error desconocido al eliminar la ruta',
          loading: false,
        });
      }
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setFilterByStatus: (status: string) => set({ filterByStatus: status }),
}));
