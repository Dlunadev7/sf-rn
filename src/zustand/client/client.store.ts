import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import ClientStorageService from './client.storage';
import { ClientPayload, ClientResponse, ClientResponsePaginated } from '@/utils/routes/routes.clients.service';
import ClientService from '@/services/clients.service';
import UserStorageService from '../user/user.storage';
import { ClientStatus, RouteStatus } from '@/utils/enum/status.enum';

interface ErrorMessage {
  message: string;
}

interface ErrorMessage {
  message: string;
}

const clientService = new ClientService();

interface ClientState {
  clients: ClientResponse[];
  clientsInRoute: ClientResponse[];
  sellerClients: ClientResponsePaginated;
  client: ClientResponse | null;
  searchTerm: string;
  filterByStatus: string;
  loading: boolean;
  error: object | null;
  clearClient: () => void;
  getClients: (page?: number, search?: string, status?: ClientStatus | undefined | string | null, competence?: boolean) => Promise<void>;
  getClientsInRoute: (
    routeId: string,
    page?: number,
    search?: string,
    status?: string | null,
    competence?: boolean,
  ) => Promise<ClientResponse[] | AxiosError>;
  getUsersSellers: (
    routeId: string,
    page?: number,
    search?: string,
    status?: RouteStatus | undefined | string | null,
  ) => Promise<ClientResponse[] | AxiosError<unknown, unknown>>;
  getClientById: (id: string) => Promise<void>;
  createClient: (payload: ClientPayload) => Promise<void | null | string | ClientResponse>;
  updateClient: (id: string, payload: ClientPayload) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setFilterByStatus: (status: string) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clients: [],
      clientsInRoute: [],
      sellerClients: {
        pagination: {
          page: 0,
          total: 0,
          itemsPerPage: 0,
          order: '',
          totalPages: 0,
        },
        result: [],
      },
      client: null,
      loading: false,
      error: null,
      searchTerm: '',
      filterByStatus: '',
      getClients: async (page = 0, search = '', status, competence = false) => {
        set({ loading: true, error: null });
        try {
          const userId = await UserStorageService.getItem('id');
          const response = await clientService.getClients({
            id: userId!,
            page,
            search,
            competence,
            status,
          });

          set((state) => ({
            clients: page !== 0 ? [...state.clients, ...response.data] : response.data,
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener la lista de clientes',
            loading: false,
          });
        }
      },

      getClientsInRoute: async (
        routeId: string,
        page?: number,
        search?: string,
        status?: string | null,
        competence: boolean = false,
      ): Promise<ClientResponse[] | AxiosError> => {
        set({ loading: true, error: null });

        try {
          const response = await clientService.getClients({
            route: routeId,
            page,
            search,
            competence,
            status,
          });

          const result = response.data;
          set((state) => ({
            clientsInRoute: page !== 0 ? [...state.clientsInRoute, ...response.data] : response.data,
            loading: false,
          }));

          return result;
        } catch (error) {
          const axiosError = error as AxiosError;

          set({
            error: axiosError.response?.data || 'Error al obtener la lista de clientes',
            loading: false,
          });

          return axiosError;
        }
      },

      getUsersSellers: async (
        routeId: string,
        page?: number,
        search?: string,
        status?: string | null,
        competence: boolean = false,
      ): Promise<ClientResponse[] | AxiosError> => {
        set({ loading: true, error: null });

        try {
          const response = await clientService.getClientsByRouteId({
            route: routeId,
            page,
            search,
            competence,
            status,
          });

          const result = response.data.result;
          set((state) => ({
            sellerClients: {
              ...state.sellerClients,
              result: page && page > 0 ? [...state.sellerClients.result, ...result] : result,
              pagination: response.data.pagination,
            },
            loading: false,
          }));

          return result;
        } catch (error) {
          const axiosError = error as AxiosError;

          set({
            error: axiosError.response?.data || 'Error al obtener la lista de clientes',
            loading: false,
          });

          return axiosError;
        }
      },

      getClientById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await clientService.getClientById(id);
          set({ client: response.data, loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener el cliente',
            loading: false,
          });
        }
      },
      createClient: async (payload: ClientPayload) => {
        set({ loading: true, error: null });
        try {
          const response = await clientService.createClient(payload);
          set((state) => ({
            clients: Array.isArray(state.clients) ? [...state.clients, response.data] : [response.data],
            loading: false,
            error: null,
          }));
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMessage: ErrorMessage =
            axiosError.response?.data && typeof axiosError.response?.data === 'object' && 'message' in axiosError.response?.data
              ? (axiosError.response?.data as { message: string })
              : { message: 'Error al crear el cliente' };
          set({ error: errorMessage, loading: false });
          return errorMessage.message;
        }
      },
      updateClient: async (id: string, payload: ClientPayload) => {
        set({ loading: true, error: null });
        try {
          const response = await clientService.updateClient(id, payload);
          set((state) => ({
            clients: state.clients?.map((client) => (client.id === id ? response.data : client)) || null,
            client: response.data,
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al actualizar el cliente',
            loading: false,
          });
        }
      },
      deleteClient: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await clientService.deleteClient(id);
          set((state) => ({
            clients: state.clients?.filter((client) => client.id !== id) || null,
            client: null,
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al eliminar el cliente',
            loading: false,
          });
        }
      },
      clearClient: () => set({ client: null }),
      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setFilterByStatus: (status: string) => set({ filterByStatus: status }),
    }),
    {
      name: 'client-storage',
      getStorage: () => ClientStorageService,
    },
  ),
);
