export interface Car {
  _id: string;
  userId: string;
  VIN: string;
  brand: string;
  model: string;
  odometerValue: number;
  year: number;
  exteriorColor: string;
  interiorColor: string;
  haveStrongScratches: boolean;
  haveSmallScratches: boolean;
  haveMalfunctions: boolean;
  haveElectricFailures: boolean;
  msrp: number;
  grade?: number;
  optimizedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarRequest {
  VIN: string;
  brand: string;
  model: string;
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
  brand?: string;
  model?: string;
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
  sortBy?: 'VIN' | 'brand' | 'model' | 'odometerValue' | 'year' | 'exteriorColor' | 'interiorColor' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface CarPriceResponse {
  car: {
    id: string;
    VIN: string;
    year: number;
    odometerValue: number;
    msrp: number;
  };
  grade: number;
  marketAdjustedPrice: number;
}

