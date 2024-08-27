// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const jwt = Cookies.get('jwt'); // Check for JWT in cookies
  return jwt ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
