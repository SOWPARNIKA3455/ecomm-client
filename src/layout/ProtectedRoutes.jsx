// layout/ProtectedRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ adminOnly = false, sellerOnly = false }) => {
  const userInfo = JSON.parse(localStorage.getItem('user'));

  //Not logged in
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route, but user is not admin
  if (adminOnly && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Seller-only route, but user is not seller
  if (sellerOnly && userInfo.role !== 'seller') {
    return <Navigate to="/seller/register" replace />;
  }

  // If admin tries to access root layout (like Home), block it
  if (!adminOnly && userInfo.role === 'admin' && window.location.pathname === '/') {
    return <Navigate to="/admindashboard" replace />;
  }

  // Passed all checks
  return <Outlet />;
};

export default ProtectedRoutes;
