import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { formatDate } from '@/utils/dateHelpers';

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1>Profile</h1>
      
      <Card className="mt-4">
        <h3>Personal Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Name</span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{user.name}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email</span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{user.email}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Role</span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Member Since</span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{formatDate(user.createdAt)}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/change-password">
            <Button variant="outline">Change Password</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

