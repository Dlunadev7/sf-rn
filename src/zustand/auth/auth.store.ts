import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '@/services/auth.service';
import { ForgotPasswordPayload, LoginServicePayload, NewPasswordPayload } from '@/utils/types/auth.types';
import { AxiosError } from 'axios';
import AuthStorageService from './auth.storage';

const authService = new AuthService();

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | object | null;
  login: (payload: LoginServicePayload) => Promise<void>;
  recoveryPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  newPassword: (payload: NewPasswordPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      loading: false,
      error: null,

      login: async (payload: LoginServicePayload) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(payload);

          const storeTokens = async () => {
            await Promise.all([
              AuthStorageService.setItem('token', response.access_token),
              AuthStorageService.setItem('refreshToken', response.refresh_token),
            ]);
          };

          await storeTokens();

          set({
            token: response.access_token,
            refreshToken: response.refresh_token,
            loading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error en la autenticación',
            loading: false,
          });
          throw new Error((axiosError.response?.data as string) || 'Error en la autenticación');
        }
      },

      recoveryPassword: async (payload: ForgotPasswordPayload) => {
        set({ loading: true, error: null });
        try {
          await authService.recoveryPassword(payload);
          set({ loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error en la recuperación de contraseña',
            loading: false,
          });
          throw new Error((axiosError.response?.data as string) || 'Error en la recuperación de contraseña');
        }
      },

      newPassword: async (payload: NewPasswordPayload) => {
        set({ loading: true, error: null });
        try {
          await authService.newPassword(payload);
          set({ loading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.response?.data || 'Error al establecer la nueva contraseña',
            loading: false,
          });
          throw new Error((axiosError.response?.data as string) || 'Error al establecer la nueva contraseña');
        }
      },

      logout: async () => {
        const removeTokens = async () => {
          await Promise.all([AuthStorageService.removeItem('token'), AuthStorageService.removeItem('refreshToken')]);
        };

        await removeTokens();

        set({ token: null, refreshToken: null, loading: false });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AuthStorageService,
    },
  ),
);
