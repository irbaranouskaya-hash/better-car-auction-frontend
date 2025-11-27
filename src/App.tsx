import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Public Pages
import { HomePage } from './pages/HomePage';

// Lazy load other pages for better performance
const AuctionsListPage = React.lazy(() => import('./pages/auctions/AuctionsListPage').then(m => ({ default: m.AuctionsListPage })));
const AuctionDetailsPage = React.lazy(() => import('./pages/auctions/AuctionDetailsPage').then(m => ({ default: m.AuctionDetailsPage })));
const CarsListPage = React.lazy(() => import('./pages/cars/CarsListPage').then(m => ({ default: m.CarsListPage })));
const CarDetailsPage = React.lazy(() => import('./pages/cars/CarDetailsPage').then(m => ({ default: m.CarDetailsPage })));
const MyCarsPage = React.lazy(() => import('./pages/cars/MyCarsPage').then(m => ({ default: m.MyCarsPage })));
const CreateCarPage = React.lazy(() => import('./pages/cars/CreateCarPage').then(m => ({ default: m.CreateCarPage })));
const EditCarPage = React.lazy(() => import('./pages/cars/EditCarPage').then(m => ({ default: m.EditCarPage })));
const MyBidsPage = React.lazy(() => import('./pages/bids/MyBidsPage').then(m => ({ default: m.MyBidsPage })));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ChangePasswordPage = React.lazy(() => import('./pages/profile/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminAuctionsPage = React.lazy(() => import('./pages/admin/AdminAuctionsPage').then(m => ({ default: m.AdminAuctionsPage })));
const CreateAuctionPage = React.lazy(() => import('./pages/admin/CreateAuctionPage').then(m => ({ default: m.CreateAuctionPage })));
const EditAuctionPage = React.lazy(() => import('./pages/admin/EditAuctionPage').then(m => ({ default: m.EditAuctionPage })));
const ManageAuctionCarsPage = React.lazy(() => import('./pages/admin/ManageAuctionCarsPage').then(m => ({ default: m.ManageAuctionCarsPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <React.Suspense fallback={<div className="loading-container"><div className="spinner" /></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auctions" element={<AuctionsListPage />} />
              <Route path="/auctions/:id" element={<AuctionDetailsPage />} />
              <Route path="/cars" element={<CarsListPage />} />
              <Route path="/cars/:id" element={<CarDetailsPage />} />

              {/* Private Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Navigate to="/my-cars" replace />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-cars"
                element={
                  <PrivateRoute>
                    <MyCarsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-cars/create"
                element={
                  <PrivateRoute>
                    <CreateCarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-cars/:id/edit"
                element={
                  <PrivateRoute>
                    <EditCarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-bids"
                element={
                  <PrivateRoute>
                    <MyBidsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <PrivateRoute>
                    <ChangePasswordPage />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions"
                element={
                  <AdminRoute>
                    <AdminAuctionsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions/create"
                element={
                  <AdminRoute>
                    <CreateAuctionPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions/:id/edit"
                element={
                  <AdminRoute>
                    <EditAuctionPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions/:id/cars"
                element={
                  <AdminRoute>
                    <ManageAuctionCarsPage />
                  </AdminRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  );
};

export default App;

