import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bidsApi } from '../../api/bids.api';
import { Bid, MyBidsFilters } from '../../types/bid.types';
import { Car } from '../../types/car.types';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { formatPrice } from '../../utils/formatters';
import { formatDateTime } from '../../utils/dateHelpers';
import { toast } from 'react-toastify';
import './MyBids.css';

interface BidWithCarDetails extends Bid {
  carDetails?: Car;
}

export const MyBidsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState<BidWithCarDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<MyBidsFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBids();
  }, [filters]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      console.log('Fetching bids with filters:', filters);
      
      const response = await bidsApi.getMyBids(filters);
      console.log('My bids response:', response);
      
      let bidsData: Bid[] = [];
      let paginationData = { totalPages: 1 };
      
      if (response.bids && Array.isArray(response.bids)) {
        bidsData = response.bids;
        paginationData = response.pagination || { totalPages: 1 };
      } else if (Array.isArray(response)) {
        bidsData = response as any;
      } else if ((response as any).data && Array.isArray((response as any).data)) {
        bidsData = (response as any).data;
        paginationData = (response as any).pagination || { totalPages: 1 };
      }

      console.log('Parsed bids:', bidsData.length);
      console.log('First bid sample:', bidsData[0]);

      // Обрабатываем ставки - carId уже содержит детали машины из бэкенда
      const bidsWithDetails = bidsData.map((bid: any) => {
        // Если carId это объект, используем его как carDetails
        if (bid.carId && typeof bid.carId === 'object') {
          return {
            ...bid,
            carDetails: bid.carId
          };
        }
        // Если carId это строка, carDetails останется undefined
        return bid;
      });

      console.log('Bids with details:', bidsWithDetails.length);
      setBids(bidsWithDetails);
      setTotalPages(paginationData.totalPages);
      setCurrentPage(filters.page || 1);
    } catch (error: any) {
      console.error('Failed to fetch bids:', error);
      toast.error('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getStatusBadge = (bid: BidWithCarDetails) => {
    if (bid.isWinning) {
      return <Badge variant="success">Leading</Badge>;
    }
    // Можно добавить больше логики определения статуса
    return <Badge variant="info">Placed</Badge>;
  };

  const handleViewAuction = (auctionId: string) => {
    navigate(`/auctions/${auctionId}`);
  };

  const handleViewCar = (carId: string) => {
    navigate(`/cars/${carId}`);
  };

  if (loading && bids.length === 0) {
    return <Loading text="Loading your bids..." />;
  }

  return (
    <div className="my-bids-page">
      <div className="container">
        <div className="my-bids-header">
          <div>
            <h1>My Bids</h1>
            <p className="subtitle">Track all your bids across different auctions</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="filters-card">
          <div className="filters-section">
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="filter-select"
              >
                <option value="createdAt">Bid Date</option>
                <option value="amount">Amount</option>
                <option value="placedAt">Placed At</option>
              </select>
              <span className="sort-direction">
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </div>

            <button onClick={handleResetFilters} className="btn-reset">
              Reset Filters
            </button>
          </div>

          <div className="results-info">
            Found {bids.length} bid(s)
          </div>
        </Card>

        {/* Bids List */}
        {bids.length === 0 ? (
          <Card className="empty-state">
            <h3>No bids found</h3>
            <p>You haven't placed any bids yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn-primary"
            >
              Browse Auctions
            </button>
          </Card>
        ) : (
          <>
            <div className="bids-list">
              {bids.map((bid) => (
                <Card key={bid._id} className="bid-card">
                  <div className="bid-card-header">
                    <div className="bid-status">
                      {getStatusBadge(bid)}
                    </div>
                    <div className="bid-date">
                      {bid.placedAt ? formatDateTime(bid.placedAt) : formatDateTime(bid.createdAt || '')}
                    </div>
                  </div>

                  <div className="bid-card-content">
                    {bid.carDetails ? (
                      <div className="car-info">
                        <h3 
                          className="car-title clickable"
                          onClick={() => handleViewCar(bid.carDetails!._id)}
                        >
                          {bid.carDetails.year} {bid.carDetails.brand} {bid.carDetails.model}
                        </h3>
                        <div className="car-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">VIN:</span>
                            <span className="detail-value">{bid.carDetails.VIN}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Year:</span>
                            <span className="detail-value">{bid.carDetails.year}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">MSRP:</span>
                            <span className="detail-value">{formatPrice(bid.carDetails.msrp)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="car-info">
                        <p className="text-muted">Car details not available</p>
                      </div>
                    )}

                    <div className="bid-amount-section">
                      <div className="bid-amount">
                        <span className="amount-label">Your Bid:</span>
                        <span className="amount-value">{formatPrice(bid.amount)}</span>
                      </div>
                      {bid.isWinning && (
                        <div className="winning-indicator">
                          <span className="winning-icon">🏆</span>
                          <span>You're winning!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bid-card-actions">
                    <button 
                      onClick={() => {
                        const auctionId = typeof bid.auctionId === 'object' ? bid.auctionId._id : bid.auctionId;
                        if (auctionId) handleViewAuction(auctionId);
                      }}
                      className="btn-secondary"
                    >
                      View Auction
                    </button>
                    {bid.carDetails && (
                      <button 
                        onClick={() => handleViewCar(bid.carDetails!._id)}
                        className="btn-outline"
                      >
                        View Car Details
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
