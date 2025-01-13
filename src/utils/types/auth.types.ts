export interface LoginServicePayload {
  email: string;
  password: string;
}

export interface LoginServiceResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface NewPasswordPayload {
  token: string;
  password: string;
}
