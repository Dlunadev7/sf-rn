import axiosInstance from '@/axios/axios.config';
import { UserRoutesService } from '@/utils/routes/routes.user.service';
import { UserResponse } from '@/utils/types/user.types';

class UserService {
  async getLoggedUser() {
    return axiosInstance.get<UserResponse>(UserRoutesService.GET_LOGGED_USER);
  }

  async deleteUser(userId: string) {
    return axiosInstance.delete(`${UserRoutesService.DELETE_USER}/${userId}`);
  }

  // async updateUserInfo(payload: UserInfoPayload) {
  //   return axiosInstance.put(`${this.baseUrl}-info/${payload.id}`, payload);
  // }
}

export default UserService;
