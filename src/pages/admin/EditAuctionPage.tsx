import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { auctionSchema, AuctionFormData } from '@/schemas/auction.schema';
import { auctionsApi } from '@/api/auctions.api';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export const EditAuctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
  });

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const auction = await auctionsApi.getAuctionById(id);
        
        // Преобразуем даты в формат datetime-local
        const formatDateForInput = (date: string | Date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setValue('name', auction.name);
        setValue('startDate', formatDateForInput(auction.startDate));
        setValue('endDate', formatDateForInput(auction.endDate));
      } catch (error: any) {
        console.error('Failed to fetch auction:', error);
        toast.error('Failed to load auction');
        navigate('/admin/auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: AuctionFormData) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await auctionsApi.updateAuction(id, data);
      toast.success('Auction updated successfully!');
      navigate('/admin/auctions');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update auction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1>Edit Auction</h1>
      
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
          <Button type="submit" loading={submitting}>Update Auction</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/auctions')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

