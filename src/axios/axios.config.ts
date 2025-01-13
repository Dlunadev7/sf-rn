import AuthStorageService from '@/zustand/auth/auth.storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AuthStorageService.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['origin-login'] = 'app';
    } catch (error) {
      console.error('Error al obtener el token de AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && error.message.includes('Token expired') && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AuthStorageService.getItem('refreshToken');

        if (!refreshToken) {
          return Promise.reject(error);
        }

        const refreshTokenResponse = await axiosInstance.post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        if (refreshTokenResponse.status === 200) {
          const newAccessToken = refreshTokenResponse.data.accessToken;

          await AuthStorageService.setItem('refreshToken', newAccessToken);

          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;
