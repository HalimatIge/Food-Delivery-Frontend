import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./component/Navbar";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuth } from './context/AuthContext';
import CartPage from './component/CartPage';
import AdminLayout from './layouts/AdminLayout';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FoodList from './pages/admin/FoodList';
import AddEditFood from './pages/admin/AddEditFood';
import NotFound from './pages/Notfound';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CheckoutPage from './component/CheckoutPage';
import OrderPage from './component/OrderPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import Profile from "./pages/Profile";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, authLoading } = useAuth();
  
  if (authLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default function AppRoutes() {
  const location = useLocation();
  const { user, authLoading } = useAuth();
  
  const hideNavbarRoutes = ["/login", "/register", "/forgotpassword"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);



  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
        />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="foods" element={<FoodList />} />
          <Route path="foods/new" element={<AddEditFood />} />
          <Route path="foods/edit/:id" element={<AddEditFood />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>
  );
}