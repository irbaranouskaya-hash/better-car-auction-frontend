export interface Car {
  _id: string;
  userId: string;
  VIN: string;
  odometerValue: number;
  year: number;
  exteriorColor: string;
  interiorColor: string;
  haveStrongScratches: boolean;
  haveSmallScratches: boolean;
  haveMalfunctions: boolean;
  haveElectricFailures: boolean;
  msrp: number;
  grade?: number; // Optional as backend calculates it
  optimizedPrice?: number; // Optional as backend calculates it
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarRequest {
  VIN: string;
  odometerValue: number;
  year: number;
  exteriorColor: string;
  interiorColor: string;
  haveStrongScratches: boolean;
  haveSmallScratches: boolean;
  haveMalfunctions: boolean;
  haveElectricFailures: boolean;
  msrp: number;
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {}

export interface CarsFilters {
  userId?: string;
  VIN?: string;
  exteriorColor?: string;
  interiorColor?: string;
  year?: number;
  minYear?: number;
  maxYear?: number;
  odometerValue?: number;
  minOdometer?: number;
  maxOdometer?: number;
  haveStrongScratches?: boolean;
  haveSmallScratches?: boolean;
  haveMalfunctions?: boolean;
  haveElectricFailures?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'VIN' | 'odometerValue' | 'year' | 'exteriorColor' | 'interiorColor' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface CarPriceResponse {
  calculatedPrice: number;
  similarCarsCount: number;
}

