export interface UserPayload {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  created_at: Date;
  deleted_at: null;
  email: string;
  id: string;
  updated_at: Date;
  userInfo: UserInfo;
}

export interface UserInfo {
  created_at: Date;
  deleted_at: null;
  fullName: string;
  phone: string;
  profilePic: null;
  updated_at: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Role {
  id: string;
}
