import { z } from 'zod';

export const auctionSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  startDate: z.string()
    .refine((date) => {
      const startDate = new Date(date);
      return startDate > new Date();
    }, 'Start date must be in the future'),
  endDate: z.string(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type AuctionFormData = z.infer<typeof auctionSchema>;

