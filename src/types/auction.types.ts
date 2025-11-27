export interface Auction {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  isActive: boolean;
  cars?: string[]; // Optional as backend might not always return it
  status: 'upcoming' | 'active' | 'ended';
  durationHours?: number; // Optional calculated field
  timeUntilStart?: number; // Optional calculated field
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuctionRequest {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateAuctionRequest extends Partial<CreateAuctionRequest> {}

export interface AuctionsFilters {
  status?: 'upcoming' | 'active' | 'ended' | 'all';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  createdBy?: string;
  search?: string;
}

export interface AddCarsToAuctionRequest {
  carIds: string[];
}

