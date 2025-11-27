import { axiosInstance } from './axios.config';
import { 
  Auction, 
  CreateAuctionRequest, 
  UpdateAuctionRequest, 
  AuctionsFilters,
  AddCarsToAuctionRequest 
} from '@/types/auction.types';
import { AuctionsResponse } from '@/types/api.types';
import { AuctionDetailsResponse } from '@/types/bid.types';

export const auctionsApi = {
  getAuctions: async (filters?: AuctionsFilters): Promise<AuctionsResponse> => {
    const response = await axiosInstance.get<any>('/auctions', { params: filters });
    console.log('Get auctions response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      // Формат: { success: true, data: [...], pagination: {...} }
      return {
        auctions: response.data.data,
        pagination: response.data.pagination
      };
    }
    if (response.data.data) {
      return {
        auctions: response.data.data,
        pagination: response.data.pagination
      };
    }
    return response.data;
  },

  getCurrentAuction: async (): Promise<Auction | null> => {
    const response = await axiosInstance.get<Auction | null>('/auctions/current');
    return response.data;
  },

  getAuctionById: async (id: string): Promise<Auction> => {
    const response = await axiosInstance.get<any>(`/auctions/${id}`);
    console.log('Raw auction response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getAuctionDetails: async (id: string): Promise<AuctionDetailsResponse> => {
    const response = await axiosInstance.get(`/bids/auctions/${id}/details`);
    console.log('Raw auction details response:', response.data);
    
    // Бэкенд возвращает: { success: true, message: "...", data: { auction: {...}, carsWithBids: [...] } }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  createAuction: async (data: CreateAuctionRequest): Promise<Auction> => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString()
    };
    
    console.log('Creating auction with data:', formattedData);
    const response = await axiosInstance.post<any>('/auctions', formattedData);
    console.log('Create auction response:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateAuction: async (id: string, data: UpdateAuctionRequest): Promise<Auction> => {
    const formattedData = {
      ...data,
      ...(data.startDate && { startDate: new Date(data.startDate).toISOString() }),
      ...(data.endDate && { endDate: new Date(data.endDate).toISOString() })
    };
    
    console.log('Updating auction with data:', formattedData);
    const response = await axiosInstance.patch<any>(`/auctions/${id}`, formattedData);
    console.log('Update auction response:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  deleteAuction: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/auctions/${id}`);
  },

  addCarsToAuction: async (auctionId: string, data: AddCarsToAuctionRequest) => {
    const response = await axiosInstance.post<any>(`/auctions/${auctionId}/cars`, data);
    console.log('Add cars response:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  removeCarFromAuction: async (auctionId: string, carId: string) => {
    await axiosInstance.delete(`/auctions/${auctionId}/cars/${carId}`);
  },

  closeAuction: async (auctionId: string) => {
    const response = await axiosInstance.post<any>(`/auctions/${auctionId}/close`);
    console.log('Close auction response:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};

