import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { auctionSchema, AuctionFormData } from '@/schemas/auction.schema';
import { auctionsApi } from '@/api/auctions.api';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
  });

  const onSubmit = async (data: AuctionFormData) => {
    try {
      setLoading(true);
      await auctionsApi.createAuction(data);
      toast.success('Auction created successfully!');
      navigate('/admin/auctions');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1>Create New Auction</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <Input
          label="Auction Name"
          placeholder="e.g., Winter Sale 2025"
          fullWidth
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Start Date"
          type="datetime-local"
          fullWidth
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <Input
          label="End Date"
          type="datetime-local"
          fullWidth
          error={errors.endDate?.message}
          {...register('endDate')}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" loading={loading}>Create Auction</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/auctions')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

