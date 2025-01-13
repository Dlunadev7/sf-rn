export enum UserRoutesActions {
  GET_LOGGED_USER = 'user/fetchLogged',
  DELETE_USER = 'user/delete',
  UPDATE_USER_INFO = 'user/updateInfo',
}
export enum UserRoutesService {
  GET_LOGGED_USER = '/user/logged',
  DELETE_USER = '/user/{id}',
  UPDATE_USER_INFO = '/user-info/{id}',
}
