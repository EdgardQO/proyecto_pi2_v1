import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function UsuarioEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Acceso denegado.</div>;
  }

  return (
    <div>
      <h1>Panel de Usuario EPS</h1>
      <p>Bienvenido, {user.username}. Tienes los roles: {user.roles.join(', ')}.</p>
      {/* Contenido específico para Usuario EPS */}
      <p>Aquí verás tus opciones como usuario de la EPS.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default UsuarioEpsDashboard;