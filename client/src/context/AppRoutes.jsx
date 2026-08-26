import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import Home from '../pages/Home';
import Doctors from '../pages/Doctors';
import Appointments from '../pages/Appointments';
import AppointmentBooking from '../pages/AppointmentBooking';

import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';

import AdminDashboard from '../pages/AdminDashboard';

import NotFound from '../pages/NotFound';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Doctors */}
      <Route
        path="/doctors"
        element={<Doctors />}
      />

      {/* Appointment Booking */}
      <Route
        path="/appointment-booking"
        element={
          <ProtectedRoute>
            <AppointmentBooking />
          </ProtectedRoute>
        }
      />

      {/* My Appointments */}
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      {/* Products */}
      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* Shopping */}
      <Route
        path="/cart"
        element={<ProtectedRoute><Cart /></ProtectedRoute>}
      />

      <Route
        path="/checkout"
        element={<ProtectedRoute><Checkout /></ProtectedRoute>}
      />

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* User */}
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />

      <Route
        path="/orders"
        element={<ProtectedRoute><Orders /></ProtectedRoute>}
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;