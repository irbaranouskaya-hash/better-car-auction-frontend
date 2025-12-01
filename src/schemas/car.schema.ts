import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const carSchema = z.object({
  VIN: z.string()
    .length(17, 'VIN must be exactly 17 characters')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format (excludes I, O, Q)'),
  brand: z.string()
    .min(1, 'Brand is required')
    .max(50, 'Brand must be at most 50 characters'),
  model: z.string()
    .min(1, 'Model is required')
    .max(50, 'Model must be at most 50 characters'),
  odometerValue: z.number()
    .int('Odometer must be a whole number')
    .min(0, 'Odometer cannot be negative')
    .max(1000000, 'Odometer value too high'),
  year: z.number()
    .int('Year must be a whole number')
    .min(1900, 'Year must be at least 1900')
    .max(currentYear + 1, `Year cannot be later than ${currentYear + 1}`),
  exteriorColor: z.string()
    .min(2, 'Exterior color must be at least 2 characters')
    .max(50, 'Exterior color must be at most 50 characters'),
  interiorColor: z.string()
    .min(2, 'Interior color must be at least 2 characters')
    .max(50, 'Interior color must be at most 50 characters'),
  haveStrongScratches: z.boolean(),
  haveSmallScratches: z.boolean(),
  haveMalfunctions: z.boolean(),
  haveElectricFailures: z.boolean(),
  msrp: z.number()
    .min(1000, 'MSRP must be at least $1,000')
    .max(10000000, 'MSRP must be at most $10,000,000'),
});

export type CarFormData = z.infer<typeof carSchema>;

