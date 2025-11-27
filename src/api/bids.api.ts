import { axiosInstance } from './axios.config';
import { Bid, CreateBidRequest, MyBidsFilters } from '@/types/bid.types';
import { BidsResponse } from '@/types/api.types';

export const bidsApi = {
  createBid: async (auctionId: string, data: CreateBidRequest): Promise<Bid> => {
    const response = await axiosInstance.post<any>(`/bids/auctions/${auctionId}/bids`, data);
    console.log('Create bid response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getMyBids: async (filters?: MyBidsFilters): Promise<BidsResponse> => {
    const response = await axiosInstance.get<any>('/bids/my-bids', { params: filters });
    console.log('My bids response:', response.data);
    
    // Обработка разных форматов ответа
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  }
};

