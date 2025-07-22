import React from 'react';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Acceso No Autorizado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <button onClick={goToLogin}>Ir a la página de inicio de sesión</button>
    </div>
  );
}

export default UnauthorizedPage;