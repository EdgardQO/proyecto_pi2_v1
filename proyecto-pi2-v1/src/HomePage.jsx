import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => {
      navigate('/login');
    });
  };

  return (
    <div>
      <h1>Bienvenido al Sistema de Administración de Flota</h1>
      {isAuthenticated() ? (
        <div>
          <p>
            Has iniciado sesión como: {user.fullName || user.username}
            {user.roles && user.roles.length > 0 ? (
              ` (Roles: ${user.roles.join(', ')})`
            ) : (
              " (Roles: No especificados)"
            )}
          </p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          {user.roles && user.roles.includes('ROLE_ADMIN_CENTRAL') && (
            <p><a href="/dashboard/admin-central">Ir al Panel de Administrador Central</a></p>
          )}
          {user.roles && user.roles.includes('ROLE_ADMIN_EPS') && (
            <p><a href="/dashboard/admin-eps">Ir al Panel de Administrador EPS</a></p>
          )}
          {user.roles && user.roles.includes('ROLE_USUARIO_EPS') && (
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