import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { carsApi } from '@/api/cars.api';
import { Car } from '@/types/car.types';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import { formatPrice, formatOdometer } from '@/utils/formatters';
import { getGradeLabel } from '@/utils/priceHelpers';
import './CarsList.css';

export const MyCarsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Модал для удаления
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMyCars = async () => {
      console.log('MyCarsPage mounted, user:', user);
      
      if (!user?.id) {
        console.warn('No user ID found, cannot fetch cars');
        setLoading(false);
        return;
      }

      try {
        console.log(1234567890);
        setLoading(true);
        console.log('Fetching cars for user:', user.id);
        
        const response = await carsApi.getCars({
          userId: user.id,
          sortBy: 'createdAt',
          order: 'desc',
        });
        
        console.log('My cars API response:', response);
        
        // Обрабатываем разные форматы ответа
        let carsData: Car[] = [];
        
        if (response.cars && Array.isArray(response.cars)) {
          carsData = response.cars;
          console.log('Found cars in response.cars:', carsData.length);
        } else if (Array.isArray(response)) {
          carsData = response as any;
          console.log('Response is array:', carsData.length);
        } else if ((response as any).data && Array.isArray((response as any).data)) {
          carsData = (response as any).data;
          console.log('Found cars in response.data:', carsData.length);
        } else {
          console.warn('Unexpected response format:', response);
        }
        
        console.log('Final parsed cars:', carsData);
        setCars(carsData);
      } catch (error: any) {
        console.error('Failed to fetch my cars:', error);
        console.error('Error response:', error.response);
        toast.error(error.response?.data?.message || 'Failed to load your cars');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCars();
  }, [user]);

  const handleOpenDeleteModal = (car: Car) => {
    setCarToDelete(car);
    setDeleteModalOpen(true);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    try {
      setDeleting(true);
      await carsApi.deleteCar(carToDelete._id);
      toast.success('Car deleted successfully!');
      
      // Удаляем из списка
      setCars(cars.filter(car => car._id !== carToDelete._id));
      
      setDeleteModalOpen(false);
      setCarToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete car:', error);
      toast.error(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="cars-list-page container">
      <div className="page-header">
        <div>
          <h1>My Cars</h1>
          <p>View and manage your registered cars</p>
        </div>
        <Link to="/my-cars/create">
          <Button>+ Add New Car</Button>
        </Link>
      </div>

      {/* Статистика */}
      <div className="results-info">
        Found {cars.length} {cars.length === 1 ? 'car' : 'cars'}
      </div>

      {/* Список машин */}
      {cars.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h3>No cars yet</h3>
            <p>You haven't added any cars to your garage yet.</p>
            <Link to="/my-cars/create">
              <Button>Add Your First Car</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <Card key={car._id} className="car-card">
              <div className="car-card-header">
                <h3>
                  <Link to={`/cars/${car._id}`} className="car-link">
                    {car.VIN}
                  </Link>
                </h3>
                <Badge 
                  variant={
                    (car.grade || 0) >= 70 ? 'success' : 
                    (car.grade || 0) >= 50 ? 'warning' : 
                    'error'
                  }
                >
                  {getGradeLabel(car.grade || 0)}
                </Badge>
              </div>

              <div className="car-card-details">
                <div className="detail-row">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">{car.year}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Odometer:</span>
                  <span className="detail-value">{formatOdometer(car.odometerValue)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Colors:</span>
                  <span className="detail-value">
                    {car.exteriorColor} / {car.interiorColor}
                  </span>
                </div>
              </div>

              <div className="car-card-pricing">
                <div className="price-item">
                  <span className="price-label">MSRP</span>
                  <span className="price-value">{formatPrice(car.msrp)}</span>
                </div>
                {car.optimizedPrice && (
                  <div className="price-item">
                    <span className="price-label">Optimized</span>
                    <span className="price-value optimized">{formatPrice(car.optimizedPrice)}</span>
                  </div>
                )}
              </div>

              <div className="car-card-condition">
                {car.haveStrongScratches && <Badge variant="error">Strong Scratches</Badge>}
                {car.haveSmallScratches && <Badge variant="warning">Small Scratches</Badge>}
                {car.haveMalfunctions && <Badge variant="error">Malfunctions</Badge>}
                {car.haveElectricFailures && <Badge variant="error">Electric Issues</Badge>}
                {!car.haveStrongScratches && !car.haveSmallScratches && 
                 !car.haveMalfunctions && !car.haveElectricFailures && (
                  <Badge variant="success">No Issues</Badge>
                )}
              </div>

              <div className="car-card-actions">
                <Link to={`/cars/${car._id}`}>
                  <Button variant="outline" fullWidth>View Details</Button>
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Link to={`/my-cars/edit/${car._id}`} style={{ flex: 1 }}>
                    <Button variant="secondary" fullWidth>Edit</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenDeleteModal(car)}
                    style={{ flex: 1, color: 'var(--error)', borderColor: 'var(--error)' }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Модал удаления */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Car"
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem' }}>
            Are you sure you want to delete <strong>{carToDelete?.VIN}</strong>?
          </p>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This action cannot be undone. The car will be removed from all auctions.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCar}
              loading={deleting}
              fullWidth
              style={{ backgroundColor: 'var(--error)' }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

