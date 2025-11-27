export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

export interface CarsResponse {
  cars?: any[];
  pagination?: PaginationResponse;
}

export interface AuctionsResponse {
  auctions?: any[];
  pagination?: PaginationResponse;
}

export interface BidsResponse {
  bids?: any[];
  pagination?: PaginationResponse;
}

