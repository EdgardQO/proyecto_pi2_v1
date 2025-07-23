import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminEpsForm from './AdminEpsForm'; // Importa el nuevo componente de formulario

function AdminCentralDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('adminEps'); // Estado para la sección activa: 'adminEps', 'eps', 'usuariosEps'

  // Estados específicos para la gestión de Admin EPS
  const [adminEpsList, setAdminEpsList] = useState([]);
  const [loadingAdminEps, setLoadingAdminEps] = useState(true);
  const [errorAdminEps, setErrorAdminEps] = useState(null);
  const [showAdminEpsForm, setShowAdminEpsForm] = useState(false);
  const [currentAdminEps, setCurrentAdminEps] = useState(null); // Admin EPS a editar (null para añadir)
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState(false);

  // Estados para roles necesarios en AdminEpsForm
  const [rolesSistema, setRolesSistema] = useState([]);
  const [adminEpsRoleId, setAdminEpsRoleId] = useState(null); // ID del rol ADMIN_EPS
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Para poder seleccionar una EPS existente al crear/editar un Admin EPS
  const [epsOptions, setEpsOptions] = useState([]); 
  const [loadingEpsOptions, setLoadingEpsOptions] = useState(true);

  useEffect(() => {
    fetchAdminEps();
    fetchRolesAndEpsOptions();
  }, []);

  const fetchAdminEps = async () => {
    setLoadingAdminEps(true);
    setErrorAdminEps(null);
    try {
      const response = await axios.get('http://localhost:8080/api/admin-eps', { withCredentials: true });
      setAdminEpsList(response.data);
    } catch (err) {
      console.error("Error al cargar administradores de EPS:", err);
      setErrorAdminEps("No se pudieron cargar los administradores de EPS.");
    } finally {
      setLoadingAdminEps(false);
    }
  };

  const fetchRolesAndEpsOptions = async () => {
    setLoadingRoles(true);
    setLoadingEpsOptions(true);
    try {
      const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema', { withCredentials: true });
      setRolesSistema(rolesSistemaResponse.data);
      const adminEpsRol = rolesSistemaResponse.data.find(rol => rol.nombreRol === 'ADMIN_EPS');
      if (adminEpsRol) {
        setAdminEpsRoleId(adminEpsRol.idRolSistema);
      } else {
        console.warn("Rol 'ADMIN_EPS' no encontrado. No se podrán crear/editar Administradores EPS.");
        setFormMessage("Advertencia: El rol 'ADMIN_EPS' no está disponible en el backend.");
        setFormError(true);
        setAdminEpsRoleId(null);
      }
    } catch (error) {
      console.error("Error al cargar roles del sistema:", error);
      setFormMessage("Error al cargar roles del sistema para el formulario.");
      setFormError(true);
    } finally {
      setLoadingRoles(false);
    }

    try {
      const epsResponse = await axios.get('http://localhost:8080/api/eps', { withCredentials: true });
      setEpsOptions(epsResponse.data);
    } catch (error) {
      console.error("Error al cargar opciones de EPS:", error);
      setFormMessage("Error al cargar las opciones de EPS para el formulario.");
      setFormError(true);
    } finally {
      setLoadingEpsOptions(false);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddAdminEpsClick = () => {
    setCurrentAdminEps(null);
    setShowAdminEpsForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleEditAdminEpsClick = (adminEpsToEdit) => {
    setCurrentAdminEps(adminEpsToEdit);
    setShowAdminEpsForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleDeleteAdminEps = async (idAdminEps) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este Administrador de EPS?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin-eps/${idAdminEps}`, { withCredentials: true });
        setFormMessage('Administrador de EPS eliminado exitosamente.');
        setFormError(false);
        fetchAdminEps(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar Administrador de EPS:', error);
        setFormMessage(`Error al eliminar Administrador de EPS: ${error.response?.data?.message || error.message}`);
        setFormError(true);
      }
    }
  };

  const handleAdminEpsFormSubmit = async (formData) => {
    setFormMessage('');
    setFormError(false);
    try {
      if (currentAdminEps) {
        await axios.put('http://localhost:8080/api/admin-eps', formData, { withCredentials: true });
        setFormMessage('Administrador de EPS actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/admin-eps', formData, { withCredentials: true });
        setFormMessage('Administrador de EPS añadido exitosamente.');
      }
      setFormError(false);
      setShowAdminEpsForm(false);
      fetchAdminEps(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar Administrador de EPS:', error);
      setFormMessage(`Error al guardar Administrador de EPS: ${error.response?.data?.message || error.message}`);
      setFormError(true);
    }
  };


  if (!user) {
    return <div>Acceso denegado.</div>;
  }

  return (
    <div>
      <h1>Panel de Administrador Central ✅</h1>
      <p>Bienvenido, {user.fullName || user.username}. Tienes los roles: {user.roles.join(', ')}.</p>

      {/* Navegación entre secciones */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveSection('adminEps')} style={{ marginRight: '10px' }}>Gestión Administradores EPS</button>
        <button onClick={() => setActiveSection('eps')} style={{ marginRight: '10px' }}>Gestión EPS</button>
        <button onClick={() => setActiveSection('usuariosEps')}>Gestión Usuarios EPS</button>
      </div>

      {/* Contenido de la sección activa */}
      {activeSection === 'adminEps' && (
        <section>
          <h2>Gestión de Administradores de EPS</h2>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button 
              onClick={handleAddAdminEpsClick} 
              disabled={loadingRoles || adminEpsRoleId === null || loadingEpsOptions || epsOptions.length === 0}
            >
              Agregar Nuevo Administrador EPS
            </button>
            {(loadingRoles || loadingEpsOptions) && <p>Cargando datos de configuración...</p>}
            {(adminEpsRoleId === null || epsOptions.length === 0) && !loadingRoles && !loadingEpsOptions && (
              <p style={{ color: 'orange' }}>Advertencia: Datos de configuración incompletos. No podrás agregar administradores de EPS.</p>
            )}
          </div>

          {showAdminEpsForm && (
            <AdminEpsForm
              adminEps={currentAdminEps}
              onSubmit={handleAdminEpsFormSubmit}
              onCancel={() => setShowAdminEpsForm(false)}
              adminEpsRoleId={adminEpsRoleId}
              epsOptions={epsOptions}
              message={formMessage}
              isError={formError}
            />
          )}

          <h3>Lista de Administradores de EPS</h3>
          {loadingAdminEps ? (
            <p>Cargando administradores de EPS...</p>
          ) : errorAdminEps ? (
            <p style={{ color: 'red' }}>{errorAdminEps}</p>
          ) : (
            adminEpsList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>DNI</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nombres</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Apellidos</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Correo</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>EPS</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {adminEpsList.map(admin => (
                    <tr key={admin.idAdminEps}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.idAdminEps}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.dni}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.nombres}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.apellidos}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.correo}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.eps?.nombreEps || 'N/A'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{admin.estado}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button onClick={() => handleEditAdminEpsClick(admin)} style={{ marginRight: '5px' }}>Editar</button>
                        <button onClick={() => handleDeleteAdminEps(admin.idAdminEps)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay administradores de EPS registrados.</p>
            )
          )}
        </section>
      )}

      {activeSection === 'eps' && (
        <section>
          <h2>Gestión de Empresas EPS</h2>
          <p>Contenido para gestionar empresas EPS (próximamente)...</p>
        </section>
      )}

      {activeSection === 'usuariosEps' && (
        <section>
          <h2>Gestión de Usuarios por EPS</h2>
          <p>Contenido para gestionar usuarios de EPS (próximamente)...</p>
        </section>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default AdminCentralDashboard;