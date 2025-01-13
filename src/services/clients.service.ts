import axiosInstance from '@/axios/axios.config';
import { ClientStatus } from '@/utils/enum/status.enum';
import { ClientPayload, ClientResponse, ClientResponsePaginated, ClientRoutesService } from '@/utils/routes/routes.clients.service';

class ClientService {
  async getClients({
    id,
    order = 'ASC',
    itemsPerPage = 15,
    page = 0,
    search,
    competence = false,
    status,
    userId,
    route,
  }: {
    userId?: string;
    id?: string;
    order?: 'ASC' | 'DESC';
    itemsPerPage?: number;
    page?: number;
    search?: string;
    competence: boolean;
    status: ClientStatus | undefined | string | null;
    route?: string;
  }) {
    const queryParams = new URLSearchParams({
      order,
      itemsPerPage: itemsPerPage.toString(),
      page: page.toString(),
      ...(search && { search }),
      ...(competence && { competence: String(competence) }),
      ...(status && { status }),
      ...(route && {
        route: route,
      }),
      ...(id && { user: id }),
    });

    const url = `${ClientRoutesService.CLIENT}?${queryParams.toString()}`;

    return axiosInstance.get<ClientResponse[]>(url);
  }

  async getClientsByRouteId({
    id,
    order = 'ASC',
    itemsPerPage = 15,
    page = 0,
    search,
    competence = false,
    status,
    userId,
    route,
  }: {
    userId?: string;
    id?: string;
    order?: 'ASC' | 'DESC';
    itemsPerPage?: number;
    page?: number;
    search?: string;
    competence: boolean;
    status: ClientStatus | undefined | string | null;
    route?: string;
  }) {
    const queryParams = new URLSearchParams({
      order,
      itemsPerPage: itemsPerPage.toString(),
      page: page.toString(),
      ...(search && { search }),
      ...(competence && { competence: String(competence) }),
      ...(status && { status }),
      ...(route && {
        route: route,
      }),
      ...(id && { user: id }),
    });
    const url = `/user/sellers?${queryParams.toString()}`;

    return axiosInstance.get<ClientResponsePaginated>(url);
  }

  async getClientById(id: string) {
    return axiosInstance.get<ClientResponse>(`${ClientRoutesService.CLIENT}/${id}`);
  }

  async createClient(payload: ClientPayload) {
    return axiosInstance.post<ClientResponse>(ClientRoutesService.CLIENT, payload);
  }

  async updateClient(id: string, payload: ClientPayload) {
    return axiosInstance.put<ClientResponse>(`${ClientRoutesService.CLIENT}/${id}`, payload);
  }

  async deleteClient(id: string) {
    return axiosInstance.delete(`${ClientRoutesService.CLIENT}/${id}`);
  }
}

export default ClientService;
