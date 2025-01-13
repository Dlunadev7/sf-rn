import axiosInstance from '@/axios/axios.config';
export interface ClientNoteResponse {
  result: Note[];
  pagination: Pagination;
}

export interface NotePayload {
  title: string;
  description: string;
  date: Date;
  client: {
    id: string;
  };
}
export interface Note {
  isReminder: boolean;
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null | Date;
  title: string;
  description: string;
  date: Date;
  user: User;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  order: string;
}

export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null | Date;
  email: string;
}

export interface ClientNotePayload {
  title: string;
  description: string;
  date: Date;
  client: {
    id: string;
  };
}

class ClientNotesService {
  // Crear una nueva nota del cliente
  async createNote(payload: ClientNotePayload): Promise<ClientNoteResponse> {
    const response = await axiosInstance.post<ClientNoteResponse>('/client-notes', payload);
    return response.data;
  }

  // Obtener todas las notas del cliente
  async getNotes(clientId: string, order: string = 'desc', itemsPerPage: number = 10, page: number = 0): Promise<ClientNoteResponse> {
    const response = await axiosInstance.get<ClientNoteResponse>('/client-notes', {
      params: {
        order,
        itemsPerPage,
        page,
        client: clientId,
      },
    });
    return response.data;
  }

  async getReminders(userId: string, order: string = 'desc', itemsPerPage: number = 10, page: number = 0): Promise<ClientNoteResponse> {
    const response = await axiosInstance.get<ClientNoteResponse>('/client-notes', {
      params: {
        order,
        itemsPerPage,
        page,
        user: userId,
      },
    });
    return response.data;
  }

  // Obtener una nota específica por ID
  async getNoteById(id: string): Promise<{ result: Note[] }> {
    const response = await axiosInstance.get<{ result: Note[] }>(`/client-notes/${id}`);
    return response.data;
  }

  // Actualizar una nota específica por ID
  async updateNoteById(id: string, payload: Omit<ClientNotePayload, 'client'>): Promise<ClientNoteResponse> {
    const response = await axiosInstance.put<ClientNoteResponse>(`/client-notes/${id}`, payload);
    return response.data;
  }

  // Eliminar una nota específica por ID
  async deleteNoteById(id: string): Promise<void> {
    await axiosInstance.delete<void>(`/client-notes/${id}`);
  }
}

export default ClientNotesService;
