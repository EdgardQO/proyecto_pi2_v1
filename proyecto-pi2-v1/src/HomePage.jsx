import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Bienvenido al Sistema de Administración de Flota</h1>
      {isAuthenticated() ? (
        <div>
          <p>Has iniciado sesión como: {user.username} (Roles: {user.roles.join(', ')})</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          {user.roles.includes('ROLE_ADMIN_CENTRAL') && (
            <p><a href="/dashboard/admin-central">Ir al Panel de Administrador Central</a></p>
          )}
          {user.roles.includes('ROLE_ADMIN_EPS') && (
            <p><a href="/dashboard/admin-eps">Ir al Panel de Administrador EPS</a></p>
          )}
          {user.roles.includes('ROLE_USUARIO_EPS') && (
            <p><a href="/dashboard/usuario-eps">Ir al Panel de Usuario EPS</a></p>
          )}
        </div>
      ) : (
        <p><a href="/login">Por favor, inicia sesión.</a></p>
      )}
    </div>
  );
}

export default HomePage;