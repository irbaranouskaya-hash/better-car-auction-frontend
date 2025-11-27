import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema, RegisterFormData } from '@/schemas/auth.schema';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import './Auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      console.log('Registration attempt with:', { name: data.name, email: data.email });
      
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);
      
      console.log('Registration successful, response:', response);
      console.log('AccessToken:', response.accessToken);
      console.log('RefreshToken:', response.refreshToken);
      console.log('User:', response.user);
      
      setAuth(response.user, response.accessToken, response.refreshToken);
      
      // Проверяем что сохранилось
      console.log('Stored in localStorage:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">Create a new account to get started.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            fullWidth
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            fullWidth
            error={errors.password?.message}
            helperText="At least 8 characters, 1 uppercase, 1 number"
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            fullWidth
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" fullWidth loading={loading}>
            Register
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

