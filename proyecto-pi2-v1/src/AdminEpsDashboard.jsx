import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail'; // Importa el componente EpsDetail

function AdminEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);
  const [usuariosEps, setUsuariosEps] = useState([]); // ✅ NUEVO ESTADO: Para almacenar los usuarios de la EPS
  const [loadingUsuarios, setLoadingUsuarios] = useState(false); // ✅ NUEVO ESTADO: Para la carga de usuarios
  const [errorUsuarios, setErrorUsuarios] = useState(null); // ✅ NUEVO ESTADO: Para errores de usuarios

  useEffect(() => {
    const fetchEpsDetails = async () => {
      if (user && typeof user.idEps === 'number' && user.idEps > 0) {
        try {
          const response = await fetch(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`, {
            credentials: 'include'
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
  }, [user]);

  // ✅ NUEVA FUNCIÓN: Para cargar los usuarios de la EPS
  const fetchUsuariosEps = async () => {
    if (user && typeof user.idEps === 'number' && user.idEps > 0) {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);
      try {
        const response = await fetch(`http://localhost:8080/api/usuarios-eps/by-eps/${user.idEps}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUsuariosEps(data);
        } else {
          const errorText = await response.text();
          setErrorUsuarios(`Error al cargar los usuarios de la EPS: ${errorText}`);
        }
      } catch (err) {
        console.error("Error de red o al cargar usuarios de EPS:", err);
        setErrorUsuarios("No se pudo conectar al servidor para obtener los usuarios de la EPS.");
      } finally {
        setLoadingUsuarios(false);
      }
    } else {
      setErrorUsuarios("ID de EPS no disponible para cargar usuarios.");
    }
  };

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

      {/* ✅ NUEVO BOTÓN: Para ver usuarios de la EPS */}
      <button onClick={fetchUsuariosEps} style={{ marginTop: '20px', marginBottom: '20px' }}>
        Ver Usuarios de mi EPS
      </button>

      {/* ✅ SECCIÓN PARA MOSTRAR USUARIOS */}
      <section>
        <h3>Usuarios Pertenecientes a mi EPS</h3>
        {loadingUsuarios ? (
          <p>Cargando usuarios...</p>
        ) : errorUsuarios ? (
          <p style={{ color: 'red' }}>{errorUsuarios}</p>
        ) : (
          usuariosEps.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>DNI</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nombres</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Apellidos</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Rol EPS</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Rol Sistema</th>
                </tr>
              </thead>
              <tbody>
                {usuariosEps.map(usuario => (
                  <tr key={usuario.idUsuarioPorEps}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.idUsuarioPorEps}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.dni}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.nombres}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.apellidos}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.estado}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.rolEps?.nombreRol}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{usuario.rolSistema?.nombreRol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay usuarios registrados para esta EPS.</p>
          )
        )}
      </section>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default AdminEpsDashboard;