import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Gavel, TrendingUp } from 'lucide-react';
import { auctionsApi } from '@/api/auctions.api';
import { Auction } from '@/types/auction.types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { formatDateTime, formatCountdown } from '@/utils/dateHelpers';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAuction = async () => {
      try {
        const auction = await auctionsApi.getCurrentAuction();
        console.log('Current auction response:', auction);
        setCurrentAuction(auction);
      } catch (error) {
        console.error('Failed to fetch current auction:', error);
        setCurrentAuction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAuction();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to Better Car Auction</h1>
          <p className="hero-subtitle">
            Automated car pricing and auction platform for buying and selling vehicles
          </p>
          <div className="hero-actions">
            <Link to="/auctions">
              <Button size="lg">
                View Auctions <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/cars">
              <Button size="lg" variant="outline">
                Browse Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Gavel size={32} />
              </div>
              <h3>Live Auctions</h3>
              <p>Participate in real-time car auctions with transparent bidding</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Smart Pricing</h3>
              <p>AI-powered pricing based on market data and car condition</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Car size={32} />
              </div>
              <h3>Quality Cars</h3>
              <p>Detailed car information with condition ratings and history</p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Auction */}
      {loading ? (
        <Loading />
      ) : currentAuction ? (
        <section className="current-auction">
          <div className="container">
            <div className="current-auction-header">
              <h2>Current Active Auction</h2>
              <Badge variant="success">Live Now</Badge>
            </div>
            <div className="current-auction-content">
              <h3>{currentAuction.name}</h3>
              <div className="current-auction-info">
                <div className="info-item">
                  <span className="info-label">Started:</span>
                  <span className="info-value">{formatDateTime(currentAuction.startDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ends:</span>
                  <span className="info-value">{formatDateTime(currentAuction.endDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time Remaining:</span>
                  <span className="info-value countdown">
                    {formatCountdown(currentAuction.endDate)}
                  </span>
                </div>
                  <div className="info-item">
                    <span className="info-label">Cars Available:</span>
                    <span className="info-value">{currentAuction.totalCars ?? currentAuction.cars?.length ?? 0}</span>
                  </div>
              </div>
              <Link to={`/auctions/${currentAuction.id}`}>
                <Button size="lg">
                  View Auction Details <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="no-auction">
          <div className="container">
            <div className="no-auction-content">
              <h2>No Active Auction</h2>
              <p>Check back soon for upcoming auctions!</p>
              <Link to="/auctions">
                <Button variant="outline">View All Auctions</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

