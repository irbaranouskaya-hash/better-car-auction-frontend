import React, { useState, useEffect } from 'react';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      setFetchingCar(true);
      const car = await carsApi.getCarById(id!);
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
      toast.error('Failed to load car details');
      navigate('/my-cars');
    } finally {
      setFetchingCar(false);
    }
  };

  const onSubmit = async (data: CarFormData) => {
    try {
      setLoading(true);
      await carsApi.updateCar(id!, data);
      toast.success('Car updated successfully!');
      navigate('/my-cars');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Failed to update car';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCar) {
    return <Loading />;
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
            placeholder="e.g., Black"
            fullWidth
            error={errors.exteriorColor?.message}
            {...register('exteriorColor')}
          />

          <Input
            label="Interior Color"
            placeholder="e.g., Beige"
            fullWidth
            error={errors.interiorColor?.message}
            {...register('interiorColor')}
          />
        </div>

        <Input
          label="MSRP ($)"
          type="number"
          placeholder="e.g., 30000"
          fullWidth
          error={errors.msrp?.message}
          {...register('msrp', { valueAsNumber: true })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>Condition</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('haveStrongScratches')} />
            <span>Has strong scratches</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('haveSmallScratches')} />
            <span>Has small scratches</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('haveMalfunctions')} />
            <span>Has malfunctions</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('haveElectricFailures')} />
            <span>Has electric failures</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/my-cars')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Car'}
          </Button>
        </div>
      </form>
    </div>
  );
};
