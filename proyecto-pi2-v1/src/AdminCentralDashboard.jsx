import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminCentralDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) { // O puedes confiar en ProtectedRoute para esto
    return <div>Acceso denegado.</div>;
  }

  return (
    <div>
      <h1>Panel de Administrador Central</h1>
      <p>Bienvenido, {user.fullName || user.username}. Tienes los roles: {user.roles.join(', ')}.</p>
      {/* Contenido específico para Administrador Central */}
      <p>Aquí verás las opciones de gestión global.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default AdminCentralDashboard;