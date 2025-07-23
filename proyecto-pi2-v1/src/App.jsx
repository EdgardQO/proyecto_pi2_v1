import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import AdminCentralDashboard from './AdminCentralDashboard';
import AdminEpsDashboard from './AdminEpsDashboard';
import UsuarioEpsDashboard from './UsuarioEpsDashboard';
import UnauthorizedPage from './UnauthorizedPage';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userHasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!userHasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/" element={<HomePage />} />

          <Route
            path="/dashboard/admin-central"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_CENTRAL']}>
                <AdminCentralDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin-eps"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_EPS']}>
                <AdminEpsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/usuario-eps"
            element={
              <ProtectedRoute allowedRoles={['USUARIO_EPS']}>
                <UsuarioEpsDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<DefaultRedirect />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

const DefaultRedirect = () => {
  const { user, isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated()) {
    if (hasRole('ADMIN_CENTRAL')) {
      return <Navigate to="/dashboard/admin-central" replace />;
    }
    if (hasRole('ADMIN_EPS')) {
      return <Navigate to="/dashboard/admin-eps" replace />;
    }
    if (hasRole('USUARIO_EPS')) {
      return <Navigate to="/dashboard/usuario-eps" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default App;