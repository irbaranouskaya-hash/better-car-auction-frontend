import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auctionsApi } from '@/api/auctions.api';
import { Auction } from '@/types/auction.types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Loading } from '@/components/common/Loading';
import { Pagination } from '@/components/common/Pagination';
import { formatDateTime, formatCountdown } from '@/utils/dateHelpers';
import './AuctionsList.css';

export const AuctionsListPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'active' | 'ended'>('all');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        
        const apiStatus = statusFilter === 'ended' ? 'all' : statusFilter;
        
        const response = await auctionsApi.getAuctions({
          status: apiStatus,
          page: currentPage,
          limit: 9,
        });
        
        console.log('Auctions API response:', response);
        
        let auctionsData: Auction[] = [];
        
        if (response.auctions) {
          auctionsData = response.auctions;
        } else if (Array.isArray(response)) {
          auctionsData = response as any;
        } else if ((response as any).data) {
          auctionsData = (response as any).data;
        }
        
        if (statusFilter === 'ended') {
          auctionsData = auctionsData.filter(
            (auction: any) => auction.status === 'ended' || auction.status === 'closed'
          );
        }
        
        console.log('Parsed auctions:', auctionsData);
        setAuctions(auctionsData);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [currentPage, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'upcoming':
        return <Badge variant="warning">Upcoming</Badge>;
      case 'ended':
        return <Badge variant="default">Ended</Badge>;
      case 'closed':
        return <Badge variant="default">Closed</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="auctions-list-page container">
      <div className="page-header">
        <h1>Auctions</h1>
        <p>Browse all available car auctions</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${statusFilter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setStatusFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${statusFilter === 'ended' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ended')}
        >
          Ended
        </button>
      </div>

      {/* Информация о результатах */}
      <div className="results-info">
        <p>Found {auctions.length} auction{auctions.length !== 1 ? 's' : ''}</p>
      </div>

      {auctions.length === 0 ? (
        <div className="empty-state">
          <h3>No auctions found</h3>
          <p>Try selecting a different status filter or check the console for errors.</p>
        </div>
      ) : (
        <>
          <div className="auctions-grid">
            {auctions.map((auction) => (
              <Link key={auction.id} to={`/auctions/${auction.id}`} className="auction-link">
                <Card hover>
                  <div className="auction-card-header">
                    <h3>{auction.name}</h3>
                    {getStatusBadge(auction.status)}
                  </div>
                  <div className="auction-card-body">
                    <div className="auction-info">
                      <span className="label">Start Date:</span>
                      <span>{formatDateTime(auction.startDate)}</span>
                    </div>
                    <div className="auction-info">
                      <span className="label">End Date:</span>
                      <span>{formatDateTime(auction.endDate)}</span>
                    </div>
                    {auction.status === 'active' && (
                      <div className="auction-info">
                        <span className="label">Time Remaining:</span>
                        <span className="countdown">{formatCountdown(auction.endDate)}</span>
                      </div>
                    )}
                      <div className="auction-info">
                        <span className="label">Cars:</span>
                        <span>{auction.totalCars ?? auction.cars?.length ?? 0}</span>
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

