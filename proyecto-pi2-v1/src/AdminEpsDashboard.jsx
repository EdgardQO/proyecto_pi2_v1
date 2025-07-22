import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail'; // Importa el nuevo componente y corrige la ruta

function AdminEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);

  useEffect(() => {
    const fetchEpsDetails = async () => {
      // Asegúrate de que user existe y user.idEps tiene un valor numérico válido
      if (user && typeof user.idEps === 'number' && user.idEps > 0) { 
        try {
          const response = await fetch(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`, {
            credentials: 'include' // ✅ CAMBIO CRÍTICO: Indica al navegador que incluya cookies/credenciales
            // Ya no necesitas el header de Authorization: Bearer para HTTP Basic con sesiones
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
        setError("ID de EPS no disponible o inválido para este usuario. Asegúrate de que el usuario esté correctamente asociado a una EPS.");
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
      <h1>Panel de Administrador EPS</h1>
      <p>Bienvenido, {user.fullName || user.username}. Tienes los roles: {user.roles.join(', ')}.</p>
      
      <h3>Gestión de su EPS</h3>
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

export default AdminEpsDashboard;