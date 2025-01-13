import axiosInstance from '@/axios/axios.config';
import { AuthRoutesService } from '@/utils/routes/routes.auth.service';
import {
  LoginServicePayload,
  LoginServiceResponse,
  ForgotPasswordPayload,
  NewPasswordPayload,
} from '@/utils/types/auth.types';

class AuthService {
  async login(payload: LoginServicePayload) {
    const response = await axiosInstance.post<LoginServiceResponse>(
      AuthRoutesService.LOGIN,
      payload,
    );

    return response.data;
  }

  async recoveryPassword(payload: ForgotPasswordPayload) {
    const response = await axiosInstance.post(
      AuthRoutesService.RECOVERY_PASSWORD,
      payload,
    );

    return response.data;
  }

  async newPassword(payload: NewPasswordPayload) {
    const response = await axiosInstance.put(
      AuthRoutesService.NEW_PASSWORD,
      payload,
    );

    return response.data;
  }
}

export default AuthService;
