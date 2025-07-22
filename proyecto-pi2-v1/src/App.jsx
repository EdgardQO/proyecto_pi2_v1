import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Importa el AuthProvider y useAuth
import LoginForm from './LoginForm'; // Tu componente de login
import HomePage from './HomePage'; // Una página de inicio o dashboard general
import AdminCentralDashboard from './AdminCentralDashboard'; // Vista para Admin Central
import AdminEpsDashboard from './AdminEpsDashboard'; // Vista para Admin EPS
import UsuarioEpsDashboard from './UsuarioEpsDashboard'; // Vista para Usuario EPS
import UnauthorizedPage from './UnauthorizedPage'; // Página para acceso denegado

import './App.css';

// Componente para proteger rutas por rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando autenticación...</div>; // O un spinner
  }

  if (!isAuthenticated()) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userHasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!userHasRequiredRole) {
      // Si está autenticado pero no tiene el rol, redirigir a una página de no autorizado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children; // Si está autenticado y tiene el rol, renderiza el componente
};

function App() {
  return (
    <AuthProvider> {/* Envuelve toda la aplicación con el proveedor de autenticación */}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas públicas o accesibles después del login (ej. una página de bienvenida) */}
          <Route path="/" element={<HomePage />} /> {/* O puedes redirigir a un dashboard por defecto */}

          {/* Rutas protegidas por rol */}
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

          {/* Redirigir a una ruta por defecto si el usuario está autenticado pero no tiene una ruta específica */}
          <Route path="*" element={<DefaultRedirect />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente para redirigir a un dashboard predeterminado según el rol si ya está logeado.
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
    // Si está autenticado pero no tiene un rol reconocido para un dashboard específico
    return <Navigate to="/unauthorized" replace />;
  }

  // Si no está autenticado, redirigir al login
  return <Navigate to="/login" replace />;
};

export default App;