import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail';
import axios from 'axios';

function UsuarioEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);

  useEffect(() => {
    const fetchEpsDetails = async () => {
      if (user && typeof user.idEps === 'number' && user.idEps > 0) {
        try {
          const response = await axios.get(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`);

          setEpsDetails(response.data);
        } catch (err) {
          console.error("Error de red o al cargar EPS:", err);
          setError("No se pudo conectar al servidor para obtener los detalles de la EPS. Asegúrate de que el backend está corriendo y el token JWT es válido.");
        } finally {
          setLoadingEps(false);
        }
      } else {
        setLoadingEps(false);
        setError("ID de EPS no disponible o inválido para este usuario. Asegúrate de que el usuario esté correctamente asociado a una EPS.");
      }
    };

    fetchEpsDetails();
  }, [user]);

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
      <p>Bienvenido, {user.fullName || user.username}. Tienes los roles: {user.roles.join(', ')}.</p>

      <h3>Mi Empresa EPS</h3>
      {loadingEps ? (
        <p>Cargando detalles de la EPS...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <EpsDetail eps={epsDetails} />
      )}

      <button onClick={handleLogout}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default UsuarioEpsDashboard;