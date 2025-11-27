import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auctionsApi } from '@/api/auctions.api';
import { carsApi } from '@/api/cars.api';
import { Auction } from '@/types/auction.types';
import { Car } from '@/types/car.types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import { formatPrice, formatOdometer } from '@/utils/formatters';
import { getGradeLabel } from '@/utils/priceHelpers';
import '../cars/CarsList.css';

export const ManageAuctionCarsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [auctionCars, setAuctionCars] = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Модал для добавления машин
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Загружаем аукцион
        const auctionData = await auctionsApi.getAuctionById(id);
        setAuction(auctionData);
        
        // Загружаем машины аукциона
        const auctionCarIds = auctionData.cars || [];
        if (auctionCarIds.length > 0) {
          const carsPromises = auctionCarIds.map((carId: any) => 
            carsApi.getCarById(typeof carId === 'string' ? carId : carId._id)
          );
          const carsData = await Promise.all(carsPromises);
          setAuctionCars(carsData.filter(Boolean));
        }
        
        // Загружаем все доступные машины
        const allCarsResponse = await carsApi.getCars({});
        console.log('All cars response:', allCarsResponse);
        
        let allCars: Car[] = [];
        if (allCarsResponse.cars && Array.isArray(allCarsResponse.cars)) {
          allCars = allCarsResponse.cars;
        } else if (Array.isArray(allCarsResponse)) {
          allCars = allCarsResponse as any;
        } else if ((allCarsResponse as any).data && Array.isArray((allCarsResponse as any).data)) {
          allCars = (allCarsResponse as any).data;
        }
        
        console.log('Parsed all cars:', allCars.length);
        
        // Фильтруем машины, которых ещё нет в аукционе
        const auctionCarIdsSet = new Set(
          auctionCarIds.map((c: any) => typeof c === 'string' ? c : c._id)
        );
        console.log('Auction car IDs:', Array.from(auctionCarIdsSet));
        
        const available = allCars.filter((car: Car) => !auctionCarIdsSet.has(car._id));
        console.log('Available cars for adding:', available.length);
        setAvailableCars(available);
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleCarSelection = (carId: string) => {
    setSelectedCarIds(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const handleAddCars = async () => {
    if (!id || selectedCarIds.length === 0) return;

    try {
      setAdding(true);
      await auctionsApi.addCarsToAuction(id, { carIds: selectedCarIds });
      toast.success(`${selectedCarIds.length} car(s) added to auction!`);
      
      // Перезагружаем данные
      const auctionData = await auctionsApi.getAuctionById(id);
      setAuction(auctionData);
      
      const auctionCarIds = auctionData.cars || [];
      const carsPromises = auctionCarIds.map((carId: any) => 
        carsApi.getCarById(typeof carId === 'string' ? carId : carId._id)
      );
      const carsData = await Promise.all(carsPromises);
      setAuctionCars(carsData.filter(Boolean));
      
      // Обновляем доступные машины
      const allCarsResponse = await carsApi.getCars({});
      
      let allCars: Car[] = [];
      if (allCarsResponse.cars && Array.isArray(allCarsResponse.cars)) {
        allCars = allCarsResponse.cars;
      } else if (Array.isArray(allCarsResponse)) {
        allCars = allCarsResponse as any;
      } else if ((allCarsResponse as any).data && Array.isArray((allCarsResponse as any).data)) {
        allCars = (allCarsResponse as any).data;
      }
      
      const auctionCarIdsSet = new Set(
        auctionCarIds.map((c: any) => typeof c === 'string' ? c : c._id)
      );
      const available = allCars.filter((car: Car) => !auctionCarIdsSet.has(car._id));
      setAvailableCars(available);
      
      setAddModalOpen(false);
      setSelectedCarIds([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add cars');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCar = async (carId: string) => {
    if (!id) return;

    try {
      await auctionsApi.removeCarFromAuction(id, carId);
      toast.success('Car removed from auction!');
      
      // Обновляем списки
      const removedCar = auctionCars.find(c => c._id === carId);
      setAuctionCars(prev => prev.filter(c => c._id !== carId));
      if (removedCar) {
        setAvailableCars(prev => [...prev, removedCar]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove car');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!auction) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>Auction not found</h2>
        <Button onClick={() => navigate('/admin/auctions')}>Back to Auctions</Button>
      </div>
    );
  }

  return (
    <div className="cars-list-page container">
      <div className="page-header">
        <div>
          <h1>Manage Cars - {auction.name}</h1>
          <p>Add or remove cars from this auction</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>+ Add Cars</Button>
      </div>

      <div className="results-info">
        {auctionCars.length} {auctionCars.length === 1 ? 'car' : 'cars'} in auction
      </div>

      {/* Машины в аукционе */}
      {auctionCars.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h3>No cars in this auction</h3>
            <p>Add cars to start receiving bids.</p>
            <Button onClick={() => setAddModalOpen(true)}>Add Cars</Button>
          </div>
        </Card>
      ) : (
        <div className="cars-grid">
          {auctionCars.map((car) => (
            <Card key={car._id} className="car-card">
              <div className="car-card-header">
                <h3>{car.VIN}</h3>
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

              <div className="car-card-actions">
                <Button
                  variant="outline"
                  onClick={() => handleRemoveCar(car._id)}
                  fullWidth
                  style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                >
                  Remove from Auction
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Button variant="outline" onClick={() => navigate('/admin/auctions')}>
          ← Back to Auctions
        </Button>
      </div>

      {/* Модал добавления машин */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedCarIds([]);
        }}
        title="Add Cars to Auction"
      >
        <div style={{ padding: '1rem 0' }}>
          {availableCars.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              No available cars to add. All cars are already in this auction.
            </p>
          ) : (
            <>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Select cars to add to the auction:
              </p>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
                {availableCars.map((car) => (
                  <label
                    key={car._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: selectedCarIds.includes(car._id) ? 'var(--bg-secondary)' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCarIds.includes(car._id)}
                      onChange={() => handleToggleCarSelection(car._id)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{car.VIN}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {car.year} • {formatOdometer(car.odometerValue)} • {formatPrice(car.msrp)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  onClick={handleAddCars}
                  loading={adding}
                  disabled={selectedCarIds.length === 0}
                  fullWidth
                >
                  Add {selectedCarIds.length > 0 ? `(${selectedCarIds.length})` : ''} Cars
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddModalOpen(false);
                    setSelectedCarIds([]);
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

