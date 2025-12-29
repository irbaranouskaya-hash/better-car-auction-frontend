import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { carsApi } from '@/api/cars.api';
import { Car, CarPriceResponse } from '@/types/car.types';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Loading } from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import { formatPrice, formatOdometer, formatVIN } from '@/utils/formatters';
import { formatDate } from '@/utils/dateHelpers';
import { getGradeLabel, calculateGradeColor } from '@/utils/priceHelpers';
import './CarDetails.css';

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [car, setCar] = useState<Car | null>(null);
  const [marketPrice, setMarketPrice] = useState<CarPriceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const carData = await carsApi.getCarById(id);
        setCar(carData);

        // Загружаем рыночную цену
        try {
          const priceData = await carsApi.getCarPrice(id);
          setMarketPrice(priceData);
        } catch (priceError) {
          console.error('Failed to fetch market price:', priceError);
        }
      } catch (error) {
        console.error('Failed to fetch car details:', error);
        toast.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await carsApi.deleteCar(id);
      toast.success('Car deleted successfully');
      navigate('/my-cars');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!car) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>Car not found</h2>
        <Link to="/cars">
          <Button variant="outline">Back to Cars</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === car.userId;

  return (
    <div className="car-details-page container">
      <div className="car-details-header">
        <div>
          <h1>{car.year} {car.brand} {car.model}</h1>
          <p className="car-subtitle">
            VIN: {formatVIN(car.VIN)} • {formatOdometer(car.odometerValue)}
          </p>
        </div>
        <Badge variant={(car.grade || 0) >= 70 ? 'success' : (car.grade || 0) >= 50 ? 'warning' : 'error'}>
          {getGradeLabel(car.grade || 0)} ({(car.grade || 0).toFixed(1)}/100)
        </Badge>
      </div>

      <div className="car-details-grid">
        <Card>
          <h3>Vehicle Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">VIN</span>
              <span className="info-value">{car.VIN}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Brand</span>
              <span className="info-value">{car.brand}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Model</span>
              <span className="info-value">{car.model}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Year</span>
              <span className="info-value">{car.year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Odometer</span>
              <span className="info-value">{formatOdometer(car.odometerValue)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Exterior Color</span>
              <span className="info-value">{car.exteriorColor}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Interior Color</span>
              <span className="info-value">{car.interiorColor}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Added Date</span>
              <span className="info-value">{formatDate(car.createdAt)}</span>
            </div>
          </div>
        </Card>

        {/* Цены */}
        <Card>
          <h3>Pricing</h3>
          <div className="pricing-section">
            <div className="price-card">
              <span className="price-label">MSRP</span>
              <span className="price-value">{formatPrice(car.msrp)}</span>
              <span className="price-description">Manufacturer's Suggested Retail Price</span>
            </div>
            <div className="price-card highlight">
              <span className="price-label">Optimized Price</span>
              <span className="price-value primary">{formatPrice(car.optimizedPrice || car.msrp || 0)}</span>
              <span className="price-description">AI-calculated optimal price</span>
            </div>
            {marketPrice && (
              <div className="price-card">
                <span className="price-label">Market Price</span>
                <span className="price-value">{formatPrice(marketPrice.marketAdjustedPrice)}</span>
                <span className="price-description">
                  Grade: {marketPrice.grade.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Состояние */}
        <Card>
          <h3>Condition</h3>
          <div className="condition-section">
            <div className="grade-display">
              <div className="grade-circle" style={{ borderColor: calculateGradeColor(car.grade || 0) }}>
                <span className="grade-number">{(car.grade || 0).toFixed(1)}</span>
                <span className="grade-max">/100</span>
              </div>
              <span className="grade-label-large">{getGradeLabel(car.grade || 0)}</span>
            </div>

            <div className="condition-list">
              <div className={`condition-item ${car.haveStrongScratches ? 'negative' : 'positive'}`}>
                <span className="condition-icon">{car.haveStrongScratches ? '❌' : '✅'}</span>
                <span>Strong Scratches</span>
              </div>
              <div className={`condition-item ${car.haveSmallScratches ? 'negative' : 'positive'}`}>
                <span className="condition-icon">{car.haveSmallScratches ? '⚠️' : '✅'}</span>
                <span>Small Scratches</span>
              </div>
              <div className={`condition-item ${car.haveMalfunctions ? 'negative' : 'positive'}`}>
                <span className="condition-icon">{car.haveMalfunctions ? '❌' : '✅'}</span>
                <span>Malfunctions</span>
              </div>
              <div className={`condition-item ${car.haveElectricFailures ? 'negative' : 'positive'}`}>
                <span className="condition-icon">{car.haveElectricFailures ? '❌' : '✅'}</span>
                <span>Electric Failures</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Действия */}
      {isOwner && (
        <Card className="actions-card">
          <h3>Actions</h3>
          <div className="actions-buttons">
            <Link to={`/my-cars/${car.id}/edit`}>
              <Button variant="primary">Edit Car</Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
              Delete Car
            </Button>
          </div>
        </Card>
      )}

      <div className="back-link">
        <Link to="/cars">← Back to Cars Catalog</Link>
      </div>

      {/* Modal удаления */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Car"
      >
        <div style={{ padding: '1rem 0' }}>
          <p>Are you sure you want to delete this car?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            VIN: {car.VIN}
          </p>
          <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '1rem' }}>
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button variant="danger" onClick={handleDelete} loading={deleting} fullWidth>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
