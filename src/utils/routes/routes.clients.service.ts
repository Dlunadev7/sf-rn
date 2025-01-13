// Tipos para el cliente

import { RouteStatus } from '../enum/status.enum';

export enum ClientRoutesActions {
  CREATE_CLIENT = 'client/create',
  GET_CLIENT = 'client/get',
  GET_CLIENT_BY_ID = 'client/getById',
  UPDATE_CLIENT = 'client/update',
  DELETE_CLIENT = 'client/delete',
}

/**
 * @param {string} CLIENT - Crear u obtener un usuario.
 * @param {string} CLIENT_BY_ID - Obtener un usuario, actualizarlo o eliminarlo.
 */
export enum ClientRoutesService {
  CLIENT = '/client',
}

type Status = 'UNSUBSCRIBED' | 'FRECUENT' | 'POTENTIAL' | 'COMPETENCE' | 'COMPETENCE_FRECUENT';

export interface ClientPayload {
  id?: string;
  name: string;
  competenceName: string;
  additionalContact: string;
  email: string;
  phone: string;
  managerName: string;
  rut: string;
  ci: string;
  department: string;
  isOneTime: boolean;
  neighborhood: string;
  address: string;
  status: Status;
  nextVisit: string;
  latitude: string;
  longitude: string;
  note: Note[];
  user: [
    {
      id: string | undefined;
    },
  ];
}

export interface ClientResponsePaginated {
  pagination: Pagination;
  result: ClientResponse[];
}

/**
 * @todo Ver que onda con las props
 */

interface UserInfo {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fullName: string;
  profilePic: string | null;
  phone: string;
  ci: string;
}

interface Role {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  permissions: string[];
}

interface ClientSellerResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string;
  isActive: boolean;
  userInfo: UserInfo;
  role: Role;
}

export interface ClientResponse {
  userInfo: {
    fullName: string;
  };
  clientInRoute: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: RouteStatus;
    updateBy: {
      id: string;
    };
  }[];
  id: string;
  name: string;
  competenceName: string;
  email: string;
  phone: string;
  additionalContact: string;
  managerName: string;
  rut: string;
  nextVisit: string;
  address: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  ci: string;
  department: string;
  isOneTime: boolean;
  neighborhood: string;
  latitude: string;
  longitude: string;
  note: Note[];
  user: [
    {
      id: string | undefined;
    },
  ];
}

// Respuestas de API

export interface GetClientResponse {
  clients: ClientResponse[];
  total: number;
}

export interface GetClientByIdResponse {
  client: ClientResponse;
}

export interface ClientsResponse {
  pagination: Pagination;
  result: ClientResponse[];
}
export interface ClientsSellerResponse {
  pagination: Pagination;
  result: ClientSellerResponse[];
}

export interface Pagination {
  itemsPerPage: number;
  order: string;
  page: number;
  total: number;
  totalPages: number;
}

export interface ClientResult {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  managerName: string | null;
  department: string;
  neighborhood: string;
  address: string;
  email: string | null;
  phone: string | null;
  alternativePhones: string[];
  rut: string | null;
  ci: string | null;
  status: string;
  competenceName: string;
  nextVisit: string | null;
  latitude: number | null;
  longitude: number | null;
  isOneTime: boolean;
  user: User[];
  clientInRoute: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: RouteStatus;
  }[];
  list: unknown[];
}

interface UserInfo {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fullName: string;
  profilePic: string | null;
  phone: string;
  ci: string;
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

export interface Note {
  title: string;
  description: string;
  date: Date;
}
