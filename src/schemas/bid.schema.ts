import { z } from 'zod';

export const bidSchema = z.object({
  amount: z.number()
    .int('Bid amount must be a whole number')
    .min(1, 'Bid amount must be at least $1')
    .max(10000000, 'Bid amount must be at most $10,000,000'),
});

export type BidFormData = z.infer<typeof bidSchema>;

