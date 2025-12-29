import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auctionsApi } from '@/api/auctions.api';
import { bidsApi } from '@/api/bids.api';
import { Auction } from '@/types/auction.types';
import { CarWithBids } from '@/types/bid.types';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Loading } from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { formatDateTime, formatCountdown } from '@/utils/dateHelpers';
import { formatPrice } from '@/utils/formatters';
import { getGradeLabel } from '@/utils/priceHelpers';
import './AuctionDetails.css';

export const AuctionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();

  const [auction, setAuction] = useState<Auction | null>(null);
  const [carsWithBids, setCarsWithBids] = useState<CarWithBids[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Модал для ставки
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitting, setBidSubmitting] = useState(false);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Загружаем детали аукциона со всеми машинами и ставками
        const detailsData = await auctionsApi.getAuctionDetails(id);
        console.log('Auction details from API:', detailsData);
        
        // Новый формат: { auction: {...}, carsWithBids: [...] }
        if (detailsData.auction) {
          setAuction(detailsData.auction as any);
        }
        
        if (detailsData.carsWithBids && Array.isArray(detailsData.carsWithBids)) {
          setCarsWithBids(detailsData.carsWithBids);
        }
        
      } catch (error) {
        console.error('Failed to fetch auction:', error);
        toast.error('Failed to load auction details');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  const handleOpenBidModal = (carId: string, currentHighestBid?: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }

    if (auction?.status !== 'active') {
      toast.error('This auction is not active');
      return;
    }

    setSelectedCarId(carId);
    setBidAmount(currentHighestBid ? String(currentHighestBid + 100) : '');
    setBidModalOpen(true);
  };

  const handleSubmitBid = async () => {
    if (!id || !selectedCarId || !bidAmount) return;

    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount < 1) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    try {
      setBidSubmitting(true);
      await bidsApi.createBid(id, {
        carId: selectedCarId,
        amount,
      });
      
      toast.success('Bid placed successfully!');
      setBidModalOpen(false);
      setBidAmount('');
      
      // Перезагружаем все данные аукциона с обновленными ставками
      const detailsData = await auctionsApi.getAuctionDetails(id);
      
      if (detailsData.auction) {
        setAuction(detailsData.auction as any);
      }
      
      if (detailsData.carsWithBids && Array.isArray(detailsData.carsWithBids)) {
        setCarsWithBids(detailsData.carsWithBids);
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'upcoming':
        return <Badge variant="warning">Upcoming</Badge>;
      case 'ended':
        return <Badge variant="default">Ended</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!auction) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>Auction not found</h2>
        <Link to="/auctions">
          <Button variant="outline">Back to Auctions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="auction-details-page container">
      {/* Заголовок */}
      <div className="auction-header">
        <div>
          <h1>{auction.name}</h1>
          <p className="auction-subtitle">
            {formatDateTime(auction.startDate)} - {formatDateTime(auction.endDate)}
          </p>
        </div>
        {getStatusBadge(auction.status)}
      </div>

      {/* Информация об аукционе */}
      <Card>
        <div className="auction-info-grid">
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className="info-value">{auction.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Start Date</span>
            <span className="info-value">{formatDateTime(auction.startDate)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">End Date</span>
            <span className="info-value">{formatDateTime(auction.endDate)}</span>
          </div>
          {auction.status === 'active' && (
            <div className="info-item">
              <span className="info-label">Time Remaining</span>
              <span className="info-value countdown">{formatCountdown(auction.endDate)}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Cars in Auction</span>
            <span className="info-value">{auction.totalCars ?? auction.cars?.length ?? 0}</span>
          </div>
        </div>
      </Card>

      {/* Список машин */}
      <div className="cars-section">
        <h2>Cars in This Auction</h2>
        
        {carsWithBids.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p>No cars in this auction yet.</p>
            </div>
          </Card>
        ) : (
          <div className="cars-list">
            {carsWithBids.map((carWithBids) => {
              const car = carWithBids.car;
              const highestBid = carWithBids.highestBid;
              const userHasBid = carWithBids.bids.some(
                (bid) => bid.user?.id === user?.id
              );

              return (
                <Card key={car.id} className="car-auction-card">
                  <div className="car-auction-header">
                    <div>
                      <h3>
                        <Link to={`/cars/${car.id}`} className="car-link">
                          {car.year} {car.brand} {car.model}
                        </Link>
                      </h3>
                      <p className="car-info">
                        VIN: {car.VIN} • {car.exteriorColor}
                      </p>
                    </div>
                    <Badge variant={(car.grade || 0) >= 70 ? 'success' : (car.grade || 0) >= 50 ? 'warning' : 'error'}>
                      {getGradeLabel(car.grade || 0)}
                    </Badge>
                  </div>

                  <div className="car-auction-body">
                    <div className="price-info">
                      <div className="price-item">
                        <span className="price-label">MSRP</span>
                        <span className="price-value">{formatPrice(car.msrp || 0)}</span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Optimized Price</span>
                        <span className="price-value">{formatPrice(car.optimizedPrice || car.msrp || 0)}</span>
                      </div>
                    </div>

                    <div className="bids-info">
                      <div className="bids-header">
                        <h4>Bids ({carWithBids.totalBids})</h4>
                        {highestBid && (
                          <div className="highest-bid">
                            <span className="highest-bid-label">Current Highest:</span>
                            <span className="highest-bid-value">{formatPrice(highestBid)}</span>
                          </div>
                        )}
                      </div>

                      {carWithBids.bids.length > 0 ? (
                        <div className="bids-list">
                          {carWithBids.bids.slice(0, 3).map((bid) => {
                            const isUserBid = bid.user?.id === user?.id;
                            const isWinning = bid.isWinning;

                            return (
                              <div 
                                key={bid.id} 
                                className={`bid-item ${isWinning ? 'winning' : ''} ${isUserBid ? 'user-bid' : ''}`}
                              >
                                <span className="bid-user">
                                  {isUserBid ? 'You' : bid.user?.name || 'Anonymous'}
                                  {isWinning && ' 🏆'}
                                </span>
                                <span className="bid-amount">{formatPrice(bid.amount)}</span>
                              </div>
                            );
                          })}
                          {carWithBids.bids.length > 3 && (
                            <p className="more-bids">+{carWithBids.bids.length - 3} more bids</p>
                          )}
                        </div>
                      ) : (
                        <p className="no-bids">No bids yet. Be the first!</p>
                      )}
                    </div>

                    {auction.status === 'active' && isAuthenticated && (
                      <Button
                        fullWidth
                        onClick={() => handleOpenBidModal(car.id, highestBid || undefined)}
                        variant={userHasBid ? 'secondary' : 'primary'}
                      >
                        {userHasBid ? 'Update Bid' : 'Place Bid'}
                      </Button>
                    )}

                    {!isAuthenticated && auction.status === 'active' && (
                      <Link to="/login">
                        <Button fullWidth variant="outline">Login to Bid</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/auctions">← Back to Auctions</Link>
      </div>

      {/* Модал для ставки */}
      <Modal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        title="Place Your Bid"
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Enter your bid amount. Your bid must be higher than the current highest bid.
          </p>
          
          <Input
            label="Bid Amount ($)"
            type="number"
            placeholder="Enter amount..."
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            fullWidth
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button
              onClick={handleSubmitBid}
              loading={bidSubmitting}
              fullWidth
            >
              Place Bid
            </Button>
            <Button
              variant="outline"
              onClick={() => setBidModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
