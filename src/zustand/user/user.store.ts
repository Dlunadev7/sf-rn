import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import UserService from '@/services/user.service';
import { AxiosError } from 'axios';
import UserStorageService from './user.storage';
import { UserInfo, UserResponse } from '@/utils/types/user.types';

const userService = new UserService();

interface UserState {
  user: Partial<UserResponse & UserInfo>;
  loading: boolean;
  error: string | object | null;
  getUser: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {},
      loading: false,
      error: null,
      getUser: async () => {
        set({ loading: true, error: null });
        try {
          const response = await userService.getLoggedUser();

          const data = {
            ...response.data.userInfo,
            id: response.data.id,
            email: response.data.email,
          };

          set({ user: data, loading: false });
          await UserStorageService.setItem('id', response.data.id);
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al obtener el usuario',
            loading: false,
          });
        }
      },
      deleteUser: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          await userService.deleteUser(userId);
          set({ user: {}, loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al eliminar el usuario',
            loading: false,
          });
        }
      },
      setUserLocation: (location) => {
        set((state) => ({
          user: {
            ...state.user,
            location,
          },
        }));
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => UserStorageService,
    },
  ),
);
