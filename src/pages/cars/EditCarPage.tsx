import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { carSchema, CarFormData } from '@/schemas/car.schema';
import { carsApi } from '@/api/cars.api';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export const EditCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        toast.error('Car ID is missing');
        navigate('/my-cars');
        return;
      }

      try {
        setFetching(true);
        const car = await carsApi.getCarById(id);
        
        reset({
          VIN: car.VIN,
          brand: car.brand,
          model: car.model,
          year: car.year,
          odometerValue: car.odometerValue,
          exteriorColor: car.exteriorColor,
          interiorColor: car.interiorColor,
          msrp: car.msrp,
          haveStrongScratches: car.haveStrongScratches,
          haveSmallScratches: car.haveSmallScratches,
          haveMalfunctions: car.haveMalfunctions,
          haveElectricFailures: car.haveElectricFailures,
        });
      } catch (error: any) {
        console.error('Failed to fetch car:', error);
        toast.error(error.response?.data?.message || 'Failed to load car');
        navigate('/my-cars');
      } finally {
        setFetching(false);
      }
    };

    fetchCar();
  }, [id, navigate, reset]);

  const onSubmit = async (data: CarFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      console.log('Updating car with data:', data);
      
      const result = await carsApi.updateCar(id, data);
      console.log('Car updated successfully:', result);
      
      toast.success('Car updated successfully!');
      navigate('/my-cars');
    } catch (error: any) {
      console.error('Failed to update car:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Failed to update car';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1>Edit Car</h1>
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
            label="Brand"
            placeholder="e.g., Toyota"
            fullWidth
            error={errors.brand?.message}
            {...register('brand')}
          />

          <Input
            label="Model"
            placeholder="e.g., Camry"
            fullWidth
            error={errors.model?.message}
            {...register('model')}
          />
        </div>

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
          <Button type="submit" loading={loading}>Update Car</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/my-cars')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
