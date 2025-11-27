import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { changePasswordSchema, ChangePasswordFormData } from '@/schemas/auth.schema';
import { authApi } from '@/api/auth.api';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);
      await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      reset();
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <h1>Change Password</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          fullWidth
          error={errors.oldPassword?.message}
          {...register('oldPassword')}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          fullWidth
          error={errors.newPassword?.message}
          helperText="At least 8 characters, 1 uppercase, 1 number"
          {...register('newPassword')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          fullWidth
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" loading={loading}>Change Password</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

