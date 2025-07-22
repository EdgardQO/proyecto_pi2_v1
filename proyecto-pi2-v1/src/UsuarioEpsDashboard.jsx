import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail'; // Importa el nuevo componente

function UsuarioEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);

  useEffect(() => {
    const fetchEpsDetails = async () => {
      if (user && user.idEps) {
        try {
          // Asumiendo que /api/eps/my-eps es el endpoint para obtener los detalles de la EPS del usuario
          const response = await fetch(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas JWT en el futuro
            }
          });
          if (response.ok) {
            const data = await response.json();
            setEpsDetails(data);
          } else {
            const errorText = await response.text();
            setError(`Error al cargar los detalles de la EPS: ${errorText}`);
          }
        } catch (err) {
          console.error("Error de red o al cargar EPS:", err);
          setError("No se pudo conectar al servidor para obtener los detalles de la EPS.");
        } finally {
          setLoadingEps(false);
        }
      } else {
        setLoadingEps(false);
        setError("ID de EPS no disponible para este usuario.");
      }
    };

    fetchEpsDetails();
  }, [user]); // Vuelve a cargar si el objeto de usuario cambia

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