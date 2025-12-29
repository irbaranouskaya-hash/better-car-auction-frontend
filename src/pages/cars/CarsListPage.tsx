import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '@/api/cars.api';
import { Car } from '@/types/car.types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Loading } from '@/components/common/Loading';
import { Pagination } from '@/components/common/Pagination';
import { formatPrice, formatOdometer } from '@/utils/formatters';
import { getGradeLabel, calculateGradeColor } from '@/utils/priceHelpers';
import './CarsList.css';

export const CarsListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [vinSearch, setVinSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minOdometer, setMinOdometer] = useState('');
  const [maxOdometer, setMaxOdometer] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'odometerValue' | 'createdAt' | 'brand' | 'model'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await carsApi.getCars({
          VIN: vinSearch || undefined,
          brand: brandSearch || undefined,
          model: modelSearch || undefined,
          minYear: minYear ? parseInt(minYear) : undefined,
          maxYear: maxYear ? parseInt(maxYear) : undefined,
          minOdometer: minOdometer ? parseInt(minOdometer) : undefined,
          maxOdometer: maxOdometer ? parseInt(maxOdometer) : undefined,
          page: currentPage,
          limit: 12,
          sortBy,
          order: sortOrder,
        });
        
        // Debug: посмотрим что пришло
        console.log('Cars API response:', response);
        
        // Обрабатываем разные форматы ответа
        let carsData: Car[] = [];
        
        if (response.cars) {
          carsData = response.cars;
        } else if (Array.isArray(response)) {
          // Если ответ сам по себе массив
          carsData = response as any;
        } else if ((response as any).data) {
          // Если данные в поле data
          carsData = (response as any).data;
        }
        
        console.log('Parsed cars:', carsData);
        setCars(carsData);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [currentPage, vinSearch, brandSearch, modelSearch, minYear, maxYear, minOdometer, maxOdometer, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setVinSearch('');
    setBrandSearch('');
    setModelSearch('');
    setMinYear('');
    setMaxYear('');
    setMinOdometer('');
    setMaxOdometer('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="cars-list-page container">
      <div className="page-header">
        <h1>Cars Catalog</h1>
        <p>Browse all available cars</p>
      </div>

      {/* Фильтры и сортировка */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Search by VIN:</label>
            <input
              type="text"
              placeholder="Enter VIN..."
              value={vinSearch}
              onChange={(e) => {
                setVinSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Brand:</label>
            <input
              type="text"
              placeholder="e.g., Toyota"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Model:</label>
            <input
              type="text"
              placeholder="e.g., Camry"
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Year:</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="From"
                value={minYear}
                onChange={(e) => {
                  setMinYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="To"
                value={maxYear}
                onChange={(e) => {
                  setMaxYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-input-small"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Odometer (km):</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="From"
                value={minOdometer}
                onChange={(e) => {
                  setMinOdometer(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="To"
                value={maxOdometer}
                onChange={(e) => {
                  setMaxOdometer(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-input-small"
              />
            </div>
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="createdAt">Date Added</option>
              <option value="brand">Brand</option>
              <option value="model">Model</option>
              <option value="year">Year</option>
              <option value="odometerValue">Odometer</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="filter-select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button onClick={handleResetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Информация о результатах */}
      <div className="results-info">
        <p>Found {cars.length} car{cars.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Список машин */}
      {cars.length === 0 ? (
        <div className="empty-state">
          <h3>No cars found</h3>
          <p>Try adjusting your filters or check the console for errors.</p>
          <button onClick={handleResetFilters} className="reset-button">
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {cars.map((car) => (
              <Link key={car.id} to={`/cars/${car.id}`} className="car-link">
                <Card hover>
                  <div className="car-card">
                    <div className="car-card-header">
                      <h3 className="car-vin">{car.year} {car.brand} {car.model}</h3>
                      <Badge variant={(car.grade || 0) >= 70 ? 'success' : (car.grade || 0) >= 50 ? 'warning' : 'error'}>
                        {getGradeLabel(car.grade || 0)}
                      </Badge>
                    </div>

                    <div className="car-card-body">
                      <div className="car-detail">
                        <span className="label">VIN:</span>
                        <span className="value">{car.VIN}</span>
                      </div>
                      <div className="car-detail">
                        <span className="label">Year:</span>
                        <span className="value">{car.year}</span>
                      </div>
                      <div className="car-detail">
                        <span className="label">Odometer:</span>
                        <span className="value">{formatOdometer(car.odometerValue)}</span>
                      </div>
                      <div className="car-detail">
                        <span className="label">Exterior:</span>
                        <span className="value">{car.exteriorColor}</span>
                      </div>
                      <div className="car-detail">
                        <span className="label">Interior:</span>
                        <span className="value">{car.interiorColor}</span>
                      </div>
                    </div>

                    <div className="car-card-footer">
                      <div className="price-section">
                        <div className="price-item">
                          <span className="price-label">MSRP:</span>
                          <span className="price-value msrp">{formatPrice(car.msrp || 0)}</span>
                        </div>
                        <div className="price-item">
                          <span className="price-label">Optimized:</span>
                          <span className="price-value optimized">{formatPrice(car.optimizedPrice || car.msrp || 0)}</span>
                        </div>
                      </div>

                      <div className="grade-bar">
                        <div 
                          className="grade-fill" 
                          style={{ 
                            width: `${car.grade || 0}%`,
                            backgroundColor: calculateGradeColor(car.grade || 0)
                          }}
                        />
                      </div>
                      <div className="grade-text">Grade: {(car.grade || 0).toFixed(1)}/100</div>
                    </div>

                    {/* Индикаторы состояния */}
                    <div className="condition-indicators">
                      {car.haveStrongScratches && (
                        <span className="indicator bad" title="Strong scratches">⚠️</span>
                      )}
                      {car.haveSmallScratches && (
                        <span className="indicator warning" title="Small scratches">⚡</span>
                      )}
                      {car.haveMalfunctions && (
                        <span className="indicator bad" title="Malfunctions">🔧</span>
                      )}
                      {car.haveElectricFailures && (
                        <span className="indicator bad" title="Electric failures">⚡</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};
