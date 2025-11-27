import { axiosInstance } from './axios.config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ChangePasswordRequest 
} from '@/types/user.types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<any>('/users/register', data);
    console.log('Register response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<any>('/users/login', data);
    console.log('Login response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post('/users/refresh-token', { refreshToken });
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await axiosInstance.post('/users/change-password', data);
    return response.data;
  },

  logoutAll: async () => {
    const response = await axiosInstance.post('/users/logout-all');
    return response.data;
  },

  deleteAccount: async (userId: string) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  },

  assignAdmin: async (userId: string) => {
    const response = await axiosInstance.post('/users/assign-admin', { userId });
    return response.data;
  },

  revokeAdmin: async (userId: string) => {
    const response = await axiosInstance.post('/users/revoke-admin', { userId });
    return response.data;
  },
};

