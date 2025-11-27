import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Manage auctions, cars, and system settings
        </p>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Auction Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>📋 All Auctions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            View, edit, delete, and close auctions
          </p>
          <Link to="/admin/auctions">
            <Button variant="outline" fullWidth>Manage Auctions</Button>
          </Link>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>➕ Create Auction</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Create a new auction with dates
          </p>
          <Link to="/admin/auctions/create">
            <Button fullWidth>Create New Auction</Button>
          </Link>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>🚗 Manage Cars</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Add or remove cars from auctions
          </p>
          <Link to="/admin/auctions">
            <Button variant="secondary" fullWidth>Go to Auctions</Button>
          </Link>
        </Card>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>🏁 Close Active Auction</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Finalize bids and determine winners
          </p>
          <Link to="/admin/auctions">
            <Button variant="outline" fullWidth>View Active Auctions</Button>
          </Link>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>📊 View All Cars</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Browse all cars in the system
          </p>
          <Link to="/cars">
            <Button variant="outline" fullWidth>Browse Cars</Button>
          </Link>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>🏠 Public Homepage</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            View the current active auction
          </p>
          <Link to="/">
            <Button variant="outline" fullWidth>Go to Homepage</Button>
          </Link>
        </Card>
      </div>

      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>💡 Admin Guide</h3>
        <ul style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem',
          lineHeight: '1.8',
          paddingLeft: '1.5rem',
          margin: '0.5rem 0 0 0'
        }}>
          <li><strong>Create Auction:</strong> Set name, start date, and end date</li>
          <li><strong>Add Cars:</strong> Go to auction → "Manage Cars" → select cars from list</li>
          <li><strong>Edit Auction:</strong> Update name or dates (can't edit active auctions)</li>
          <li><strong>Close Auction:</strong> Manually end an active auction and finalize bids</li>
          <li><strong>Delete Auction:</strong> Remove auction permanently (all bids will be lost)</li>
        </ul>
      </div>
    </div>
  );
};

