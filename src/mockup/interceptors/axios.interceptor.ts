import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const AxiosInterceptor = () => {
  // Intercepta las respuestas
  axios.interceptors.response.use(
    async (response: AxiosResponse) => {
      return response; // Devuelve la respuesta si es exitosa
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Verifica si el error es debido a un token expirado y si no hemos reintentado la solicitud ya
      if (
        error.response?.status === 401 &&
        error.message.includes('Token expired') &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Marca la solicitud como reintentada

        try {
          // Hace una solicitud para refrescar el token
          const refreshTokenResponse = await axios.post(
            '/refresh-token',
            {},
            {
              headers: { Authorization: `Bearer ${'refresh_token'}` },
            },
          );

          if (refreshTokenResponse.status === 200) {
            // Guarda el nuevo token
            const newAccessToken = refreshTokenResponse.data.accessToken;

            // Configura la autorización con el nuevo token
            axios.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`;

            // Asegura que los headers existen antes de intentar asignar el nuevo token
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;

            // Reintenta la solicitud original con el nuevo token
            return axios(originalRequest);
          }
        } catch (refreshError) {
          return error;
        }
      }

      // Si ocurre cualquier otro error, lo rechaza
      return Promise.reject(error);
    },
  );
};
