import { Routes, Route, Navigate } from 'react-router-dom'
import React, { useContext } from 'react';
import LoginPage from '../LoginPage/loginpage'
import DiningLocation from '../DiningLocation/dininglocation'
import CoffeeShop from '../CoffeeShop/CoffeeShop'
import Admindashboard from '../AdminPanel/adminpages/admindashboard';
import AdminCrew from '../AdminPanel/adminpages/admincrew';
import AdminMenu from '../AdminPanel/adminpages/adminmenu';
import AdminOrder from '../AdminPanel/adminpages/Order/adminorder';
import AdminPayment from '../AdminPanel/adminpages/Order/adminpayment';
import { UserContext } from '../../context/UserContext';

function AdminProtectedRoute({ children }) {
  const { user, userType } = useContext(UserContext);
  if (!user || userType !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function CrewProtectedRoute({ children }) {
  const { crew, userType } = useContext(UserContext);
  if (!crew || userType !== 'crew') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dining-location" element={
        <CrewProtectedRoute>
          <DiningLocation />
        </CrewProtectedRoute>
      } />
      <Route path="/coffee-shop" element={<CoffeeShop />} />
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <Admindashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/crew" element={
        <AdminProtectedRoute>
          <AdminCrew />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/menu" element={
        <AdminProtectedRoute>
          <AdminMenu />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <AdminProtectedRoute>
          <AdminOrder />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <AdminProtectedRoute>
          <AdminPayment />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;