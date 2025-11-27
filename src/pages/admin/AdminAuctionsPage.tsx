import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auctionsApi } from '@/api/auctions.api';
import { Auction } from '@/types/auction.types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import { formatDateTime, formatCountdown } from '@/utils/dateHelpers';
import '../../pages/auctions/AuctionsList.css';

export const AdminAuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Модалы
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionsApi.getAuctions({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      const auctionsData = response.auctions || [];
      setAuctions(auctionsData);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      toast.error('Failed to load auctions');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [statusFilter]);

  const handleOpenDeleteModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setDeleteModalOpen(true);
  };

  const handleOpenCloseModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setCloseModalOpen(true);
  };

  const handleDeleteAuction = async () => {
    if (!selectedAuction) return;

    try {
      setActionLoading(true);
      await auctionsApi.deleteAuction(selectedAuction._id);
      toast.success('Auction deleted successfully!');
      setAuctions(auctions.filter(a => a._id !== selectedAuction._id));
      setDeleteModalOpen(false);
      setSelectedAuction(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete auction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseAuction = async () => {
    if (!selectedAuction) return;

    try {
      setActionLoading(true);
      await auctionsApi.closeAuction(selectedAuction._id);
      toast.success('Auction closed successfully!');
      await fetchAuctions();
      setCloseModalOpen(false);
      setSelectedAuction(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to close auction');
    } finally {
      setActionLoading(false);
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

  return (
    <div className="auctions-list-page container">
      <div className="page-header">
        <div>
          <h1>Manage Auctions</h1>
          <p>View and manage all auctions</p>
        </div>
        <Link to="/admin/auctions/create">
          <Button>+ Create Auction</Button>
        </Link>
      </div>

      {/* Фильтр по статусу */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        Found {auctions.length} {auctions.length === 1 ? 'auction' : 'auctions'}
      </div>

      {/* Список аукционов */}
      {auctions.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h3>No auctions found</h3>
            <p>Create your first auction to get started.</p>
            <Link to="/admin/auctions/create">
              <Button>Create Auction</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="auctions-grid">
          {auctions.map((auction) => (
            <Card key={auction._id} className="auction-card">
              <div className="auction-card-header">
                <h3>
                  <Link to={`/auctions/${auction._id}`}>
                    {auction.name}
                  </Link>
                </h3>
                {getStatusBadge(auction.status)}
              </div>

              <div className="auction-card-body">
                <div className="auction-info">
                  <div className="info-row">
                    <span className="info-label">Start:</span>
                    <span className="info-value">{formatDateTime(auction.startDate)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">End:</span>
                    <span className="info-value">{formatDateTime(auction.endDate)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Cars:</span>
                    <span className="info-value">{auction.cars?.length || 0}</span>
                  </div>
                  {auction.status === 'active' && (
                    <div className="info-row">
                      <span className="info-label">Time left:</span>
                      <span className="info-value countdown">{formatCountdown(auction.endDate)}</span>
                    </div>
                  )}
                </div>

                <div className="auction-card-actions">
                  <Link to={`/auctions/${auction._id}`}>
                    <Button variant="outline" fullWidth>View Details</Button>
                  </Link>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Link to={`/admin/auctions/edit/${auction._id}`} style={{ flex: 1 }}>
                      <Button variant="secondary" fullWidth>Edit</Button>
                    </Link>
                    <Link to={`/admin/auctions/${auction._id}/cars`} style={{ flex: 1 }}>
                      <Button variant="secondary" fullWidth>Manage Cars</Button>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {auction.status === 'active' && (
                      <Button
                        variant="outline"
                        onClick={() => handleOpenCloseModal(auction)}
                        fullWidth
                        style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}
                      >
                        Close Auction
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDeleteModal(auction)}
                      fullWidth
                      style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                    >
                      Delete
                    </Button>
                  </div>
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
        title="Delete Auction"
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem' }}>
            Are you sure you want to delete <strong>{selectedAuction?.name}</strong>?
          </p>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This action cannot be undone. All bids will be lost.
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
              onClick={handleDeleteAuction}
              loading={actionLoading}
              fullWidth
              style={{ backgroundColor: 'var(--error)' }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модал закрытия */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Close Auction"
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem' }}>
            Are you sure you want to close <strong>{selectedAuction?.name}</strong>?
          </p>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This will finalize all bids and determine winners. This action cannot be undone.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="outline"
              onClick={() => setCloseModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseAuction}
              loading={actionLoading}
              fullWidth
              style={{ backgroundColor: 'var(--warning)' }}
            >
              Close Auction
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

