import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { carSchema, CarFormData } from '@/schemas/car.schema';
import { carsApi } from '@/api/cars.api';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export const CreateCarPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      haveStrongScratches: false,
      haveSmallScratches: false,
      haveMalfunctions: false,
      haveElectricFailures: false,
    },
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      setLoading(true);
      console.log('Creating car with data:', data);
      
      const result = await carsApi.createCar(data);
      console.log('Car created successfully:', result);
      
      toast.success('Car created successfully!');
      navigate('/my-cars');
    } catch (error: any) {
      console.error('Failed to create car:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Failed to create car';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1>Add New Car</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <Input
          label="VIN"
          placeholder="17-character VIN"
          fullWidth
          error={errors.VIN?.message}
          {...register('VIN')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <Input
            label="Year"
            type="number"
            placeholder="e.g., 2020"
            fullWidth
            error={errors.year?.message}
            {...register('year', { valueAsNumber: true })}
          />

          <Input
            label="Odometer (km)"
            type="number"
            placeholder="e.g., 50000"
            fullWidth
            error={errors.odometerValue?.message}
            {...register('odometerValue', { valueAsNumber: true })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <Input
            label="Exterior Color"
            placeholder="e.g., Blue"
            fullWidth
            error={errors.exteriorColor?.message}
            {...register('exteriorColor')}
          />

          <Input
            label="Interior Color"
            placeholder="e.g., Black"
            fullWidth
            error={errors.interiorColor?.message}
            {...register('interiorColor')}
          />
        </div>

        <Input
          label="MSRP ($)"
          type="number"
          placeholder="e.g., 35000"
          fullWidth
          error={errors.msrp?.message}
          {...register('msrp', { valueAsNumber: true })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 500 }}>Condition</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('haveStrongScratches')} />
              Has strong scratches
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('haveSmallScratches')} />
              Has small scratches
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('haveMalfunctions')} />
              Has malfunctions
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('haveElectricFailures')} />
              Has electric failures
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" loading={loading}>Create Car</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/my-cars')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

