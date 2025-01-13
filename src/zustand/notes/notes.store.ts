import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import NotesStorageService from './notes.storage';
import ClientNotesService, { ClientNotePayload, Note, NotePayload } from '@/services/notes.service';

const clientNotesService = new ClientNotesService();

interface ClientNoteState {
  notes: Note[];
  note: Note | null;
  loading: boolean;
  error: string | object | null;
  reminders: Note[];
  clearNote: () => void;
  getNotes: (id: string) => Promise<void>;
  getReminders: (userId: string) => Promise<void>;
  getNoteById: (id: string) => Promise<void>;
  createNote: (payload: NotePayload) => Promise<void>;
  updateNote: (id: string, payload: Omit<ClientNotePayload, 'client'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<ClientNoteState>()(
  persist(
    (set) => ({
      notes: [],
      note: null,
      reminders: [],
      loading: false,
      error: null,
      getNotes: async (clientId: string, order: string = 'ASC', itemsPerPage: number = 10, page: number = 0) => {
        set({ loading: true, error: null });
        try {
          const response = await clientNotesService.getNotes(clientId, order, itemsPerPage, page);
          set({ notes: response.result, loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener las notas',
            loading: false,
          });
        }
      },
      getReminders: async (userId: string, order: string = 'ASC', itemsPerPage: number = 10, page: number = 0) => {
        set({ loading: true, error: null });
        try {
          const response = await clientNotesService.getReminders(userId, order, itemsPerPage, page);
          const { result: notes, pagination } = response;

          set((state) => ({
            reminders: page === 0 ? notes : [...state.reminders, ...notes],
            pagination: pagination,
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener las notas',
            loading: false,
          });
        }
      },

      getNoteById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await clientNotesService.getNoteById(id);
          set({ note: response.result[0], loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener la nota',
            loading: false,
          });
        }
      },

      createNote: async (payload: NotePayload) => {
        set({ loading: true, error: null });
        try {
          const response = await clientNotesService.createNote(payload);

          const newNote = response.result[0];

          set((state) => {
            const updatedNotes = [...state.notes, newNote];

            return {
              notes: updatedNotes,
              loading: false,
            };
          });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al crear la nota',
            loading: false,
          });
        }
      },

      updateNote: async (id: string, payload: Omit<ClientNotePayload, 'client'>) => {
        set({ loading: true, error: null });
        try {
          const response = await clientNotesService.updateNoteById(id, payload);
          set((state) => ({
            notes: state.notes.map((note) => (note.id === id ? response.result[0] : note)),
            note: response.result[0],
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al actualizar la nota',
            loading: false,
          });
        }
      },

      deleteNote: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await clientNotesService.deleteNoteById(id);
          set((state) => ({
            notes: state.notes?.filter((note) => note.id !== id) || [],
            note: null,
            loading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al eliminar la nota',
            loading: false,
          });
        }
      },
      clearNote: () => set({ note: null }),
    }),
    {
      name: 'client-note-storage',
      getStorage: () => NotesStorageService,
    },
  ),
);
