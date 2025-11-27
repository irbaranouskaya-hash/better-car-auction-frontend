import { axiosInstance } from './axios.config';
import { 
  Car, 
  CreateCarRequest, 
  UpdateCarRequest, 
  CarsFilters,
  CarPriceResponse 
} from '@/types/car.types';
import { CarsResponse } from '@/types/api.types';

export const carsApi = {
  getCars: async (filters?: CarsFilters): Promise<CarsResponse> => {
    const response = await axiosInstance.get<any>('/cars', { params: filters });
    console.log('Get cars response:', response.data);
    console.log('Filters used:', filters);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      // Формат: { success: true, data: { cars: [...], pagination: {...} } }
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getCarById: async (id: string): Promise<Car> => {
    const response = await axiosInstance.get<any>(`/cars/${id}`);
    console.log('Raw car response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getCarPrice: async (id: string): Promise<CarPriceResponse> => {
    const response = await axiosInstance.get<CarPriceResponse>(`/cars/${id}/price`);
    return response.data;
  },

  createCar: async (data: CreateCarRequest): Promise<Car> => {
    const response = await axiosInstance.post<any>('/cars', data);
    console.log('Create car response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateCar: async (id: string, data: UpdateCarRequest): Promise<Car> => {
    const response = await axiosInstance.put<any>(`/cars/${id}`, data);
    console.log('Update car response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  deleteCar: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/cars/${id}`);
  },
};

