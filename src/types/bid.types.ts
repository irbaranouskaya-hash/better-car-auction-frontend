import { Car } from './car.types';

export interface Bid {
  _id: string;
  // Для AuctionDetails endpoint
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  // Для MyBids endpoint
  userId?: string;
  auctionId?: any; // может быть string или объект с деталями аукциона
  carId?: any; // может быть string или объект с деталями машины
  amount: number;
  isWinning: boolean;
  placedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBidRequest {
  carId: string;
  amount: number;
}

export interface MyBidsFilters {
  auctionId?: string;
  carId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'amount' | 'placedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CarWithBids {
  car: Car;
  bids: Bid[];
  highestBid: number | null;
  winner: {
    _id: string;
    name: string;
    email: string;
  } | null;
  totalBids: number;
}

export interface AuctionDetailsResponse {
  auction: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    totalCars: number;
  };
  carsWithBids: CarWithBids[];
}

