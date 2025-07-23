import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminEpsForm from './AdminEpsForm';
import EpsForm from './EpsForm'; // Nuevo componente
import UserEpsForm from './UserEpsForm'; // Componente refactorizado

function AdminCentralDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('adminEps');

  // Estados para la gestión de Admin EPS
  const [adminEpsList, setAdminEpsList] = useState([]);
  const [loadingAdminEps, setLoadingAdminEps] = useState(true);
  const [errorAdminEps, setErrorAdminEps] = useState(null);
  const [showAdminEpsForm, setShowAdminEpsForm] = useState(false);
  const [currentAdminEps, setCurrentAdminEps] = useState(null);

  // Estados para la gestión de EPS
  const [epsList, setEpsList] = useState([]); // Nueva lista para EPS
  const [loadingEpsList, setLoadingEpsList] = useState(true); // Nuevo estado de carga
  const [errorEpsList, setErrorEpsList] = useState(null); // Nuevo estado de error
  const [showEpsForm, setShowEpsForm] = useState(false); // Nuevo estado para mostrar formulario de EPS
  const [currentEps, setCurrentEps] = useState(null); // Nueva EPS a editar

  // Estados para la gestión de Usuarios por EPS (globalmente)
  const [usuariosEpsGlobalList, setUsuariosEpsGlobalList] = useState([]); // Lista global de usuarios EPS
  const [loadingUsuariosEpsGlobal, setLoadingUsuariosEpsGlobal] = useState(true);
  const [errorUsuariosEpsGlobal, setErrorUsuariosEpsGlobal] = useState(null);
  const [showUserEpsFormGlobal, setShowUserEpsFormGlobal] = useState(false); // Mostrar formulario global
  const [currentUserEpsGlobal, setCurrentUserEpsGlobal] = useState(null); // Usuario EPS global a editar

  // Estados compartidos para formularios (roles y opciones de EPS)
  const [rolesSistema, setRolesSistema] = useState([]);
  const [adminEpsRoleId, setAdminEpsRoleId] = useState(null); // ID del rol ADMIN_EPS
  const [usuarioEpsRoleId, setUsuarioEpsRoleId] = useState(null); // ID del rol USUARIO_EPS
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [epsOptions, setEpsOptions] = useState([]);
  const [loadingEpsOptions, setLoadingEpsOptions] = useState(true);
  const [rolesEpsOptions, setRolesEpsOptions] = useState([]); // Para roles específicos de EPS

  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    fetchAdminEps();
    fetchEps(); // Cargar la lista de EPS al inicio
    fetchUsuariosEpsGlobal(); // Cargar la lista global de usuarios EPS
    fetchRolesAndEpsOptions(); // Esto ya carga roles y opciones de EPS para formularios
  }, []);

  // --- Funciones de Carga de Datos ---
  const fetchAdminEps = async () => {
    setLoadingAdminEps(true);
    setErrorAdminEps(null);
    try {
      const response = await axios.get('http://localhost:8080/api/admin-eps');
      setAdminEpsList(response.data);
    } catch (err) {
      console.error("Error al cargar administradores de EPS:", err);
      setErrorAdminEps("No se pudieron cargar los administradores de EPS.");
    } finally {
      setLoadingAdminEps(false);
    }
  };

  const fetchEps = async () => {
    setLoadingEpsList(true);
    setErrorEpsList(null);
    try {
      const response = await axios.get('http://localhost:8080/api/eps'); // Requiere ROLE_ADMIN_CENTRAL
      setEpsList(response.data);
    } catch (err) {
      console.error("Error al cargar empresas EPS:", err);
      setErrorEpsList("No se pudieron cargar las empresas EPS. Asegúrate de tener el rol ADMIN_CENTRAL.");
    } finally {
      setLoadingEpsList(false);
    }
  };

  const fetchUsuariosEpsGlobal = async () => {
    setLoadingUsuariosEpsGlobal(true);
    setErrorUsuariosEpsGlobal(null);
    try {
      const response = await axios.get('http://localhost:8080/api/usuarios-eps'); // Requiere ROLE_ADMIN_CENTRAL
      setUsuariosEpsGlobalList(response.data);
    } catch (err) {
      console.error("Error al cargar usuarios de EPS globalmente:", err);
      setErrorUsuariosEpsGlobal("No se pudieron cargar los usuarios de EPS globalmente. Asegúrate de tener el rol ADMIN_CENTRAL.");
    } finally {
      setLoadingUsuariosEpsGlobal(false);
    }
  };

  const fetchRolesAndEpsOptions = async () => {
    setLoadingRoles(true);
    setLoadingEpsOptions(true);
    try {
      const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema');
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
      const usuarioEpsRol = rolesSistemaResponse.data.find(rol => rol.nombreRol === 'USUARIO_EPS');
      if (usuarioEpsRol) {
        setUsuarioEpsRoleId(usuarioEpsRol.idRolSistema);
      } else {
        console.warn("Rol 'USUARIO_EPS' no encontrado.");
        setFormMessage("Advertencia: El rol 'USUARIO_EPS' no está disponible en el backend.");
        setFormError(true);
        setUsuarioEpsRoleId(null);
      }

      const rolesEpsResponse = await axios.get('http://localhost:8080/api/roles-eps');
      setRolesEpsOptions(rolesEpsResponse.data); // Opciones de roles específicos de EPS

    } catch (error) {
      console.error("Error al cargar roles del sistema:", error);
      setFormMessage("Error al cargar roles del sistema para el formulario.");
      setFormError(true);
    } finally {
      setLoadingRoles(false);
    }

    try {
      const epsResponse = await axios.get('http://localhost:8080/api/eps');
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

  // --- Funciones de Gestión de Admin EPS ---
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
        await axios.delete(`http://localhost:8080/api/admin-eps/${idAdminEps}`);
        setFormMessage('Administrador de EPS eliminado exitosamente.');
        setFormError(false);
        fetchAdminEps();
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
        await axios.put('http://localhost:8080/api/admin-eps', formData);
        setFormMessage('Administrador de EPS actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/admin-eps', formData);
        setFormMessage('Administrador de EPS añadido exitosamente.');
      }
      setFormError(false);
      setShowAdminEpsForm(false);
      fetchAdminEps();
    } catch (error) {
      console.error('Error al guardar Administrador de EPS:', error);
      let errorMessage = 'Error desconocido al guardar Administrador de EPS.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.response.data || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setFormMessage(`Error al guardar Administrador de EPS: ${errorMessage}`);
      setFormError(true);
    }
  };


  // --- Funciones de Gestión de EPS ---
  const handleAddEpsClick = () => {
    setCurrentEps(null);
    setShowEpsForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleEditEpsClick = (epsToEdit) => {
    setCurrentEps(epsToEdit);
    setShowEpsForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleDeleteEps = async (idEps) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta EPS?')) {
      try {
        await axios.delete(`http://localhost:8080/api/eps/${idEps}`); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('EPS eliminada exitosamente.');
        setFormError(false);
        fetchEps(); // Recargar la lista de EPS
      } catch (error) {
        console.error('Error al eliminar EPS:', error);
        setFormMessage(`Error al eliminar EPS: ${error.response?.data?.message || error.message}`);
        setFormError(true);
      }
    }
  };

  const handleEpsFormSubmit = async (formData) => {
    setFormMessage('');
    setFormError(false);
    try {
      if (currentEps) {
        await axios.put('http://localhost:8080/api/eps', formData); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('EPS actualizada exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/eps', formData); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('EPS añadida exitosamente.');
      }
      setFormError(false);
      setShowEpsForm(false);
      fetchEps(); // Recargar la lista de EPS
    } catch (error) {
      console.error('Error al guardar EPS:', error);
      let errorMessage = 'Error desconocido al guardar EPS.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.response.data || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setFormMessage(`Error al guardar EPS: ${errorMessage}`);
      setFormError(true);
    }
  };


  // --- Funciones de Gestión de Usuarios por EPS (global) ---
  const handleAddUserEpsClick = () => {
    setCurrentUserEpsGlobal(null);
    setShowUserEpsFormGlobal(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleEditUserEpsClick = (userToEdit) => {
    setCurrentUserEpsGlobal(userToEdit);
    setShowUserEpsFormGlobal(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleDeleteUserEps = async (idUsuarioPorEps) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario de EPS?')) {
      try {
        await axios.delete(`http://localhost:8080/api/usuarios-eps/${idUsuarioPorEps}`); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('Usuario de EPS eliminado exitosamente.');
        setFormError(false);
        fetchUsuariosEpsGlobal(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar usuario de EPS:', error);
        setFormMessage(`Error al eliminar usuario de EPS: ${error.response?.data?.message || error.message}`);
        setFormError(true);
      }
    }
  };

  const handleUserEpsFormSubmit = async (formData) => {
    setFormMessage('');
    setFormError(false);
    try {
      if (currentUserEpsGlobal) {
        await axios.put('http://localhost:8080/api/usuarios-eps', formData); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('Usuario de EPS actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/usuarios-eps', formData); // Requiere ROLE_ADMIN_CENTRAL
        setFormMessage('Usuario de EPS añadido exitosamente.');
      }
      setFormError(false);
      setShowUserEpsFormGlobal(false);
      fetchUsuariosEpsGlobal(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar usuario de EPS:', error);
      let errorMessage = 'Error desconocido al guardar usuario de EPS.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.response.data || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setFormMessage(`Error al guardar usuario de EPS: ${errorMessage}`);
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
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button
              onClick={handleAddEpsClick}
            >
              Agregar Nueva EPS
            </button>
          </div>
          {showEpsForm && (
            <EpsForm
              eps={currentEps}
              onSubmit={handleEpsFormSubmit}
              onCancel={() => setShowEpsForm(false)}
              message={formMessage}
              isError={formError}
            />
          )}
          <h3>Lista de Empresas EPS</h3>
          {loadingEpsList ? (
            <p>Cargando empresas EPS...</p>
          ) : errorEpsList ? (
            <p style={{ color: 'red' }}>{errorEpsList}</p>
          ) : (
            epsList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nombre EPS</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>RUC</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {epsList.map(eps => (
                    <tr key={eps.idEps}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{eps.idEps}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{eps.nombreEps}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{eps.ruc}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{eps.estado}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button onClick={() => handleEditEpsClick(eps)} style={{ marginRight: '5px' }}>Editar</button>
                        <button onClick={() => handleDeleteEps(eps.idEps)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay empresas EPS registradas.</p>
            )
          )}
        </section>
      )}

      {activeSection === 'usuariosEps' && (
        <section>
          <h2>Gestión de Usuarios por EPS</h2>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button
              onClick={handleAddUserEpsClick}
              disabled={loadingRoles || usuarioEpsRoleId === null || loadingEpsOptions || epsOptions.length === 0 || rolesEpsOptions.length === 0}
            >
              Agregar Nuevo Usuario EPS
            </button>
            {(loadingRoles || loadingEpsOptions || rolesEpsOptions.length === 0) && <p>Cargando datos de configuración...</p>}
            {(usuarioEpsRoleId === null || epsOptions.length === 0 || rolesEpsOptions.length === 0) && !loadingRoles && !loadingEpsOptions && (
              <p style={{ color: 'orange' }}>Advertencia: Datos de configuración incompletos. No podrás agregar usuarios de EPS.</p>
            )}
          </div>
          {showUserEpsFormGlobal && (
            <UserEpsForm
              user={currentUserEpsGlobal}
              onSubmit={handleUserEpsFormSubmit}
              onCancel={() => setShowUserEpsFormGlobal(false)}
              idEpsOptions={epsOptions} // Pasar todas las opciones de EPS
              rolesEpsOptions={rolesEpsOptions} // Pasar todas las opciones de roles EPS
              usuarioEpsRoleId={usuarioEpsRoleId} // Pasar el ID del rol de sistema para USUARIO_EPS
              message={formMessage}
              isError={formError}
            />
          )}
          <h3>Lista de Usuarios por EPS</h3>
          {loadingUsuariosEpsGlobal ? (
            <p>Cargando usuarios por EPS...</p>
          ) : errorUsuariosEpsGlobal ? (
            <p style={{ color: 'red' }}>{errorUsuariosEpsGlobal}</p>
          ) : (
            usuariosEpsGlobalList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>DNI</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nombres</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Apellidos</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>EPS</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Rol EPS</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosEpsGlobalList.map(user => (
                    <tr key={user.idUsuarioPorEps}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.idUsuarioPorEps}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.dni}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.nombres}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.apellidos}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.eps?.nombreEps || 'N/A'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.rolEps?.nombreRol || 'N/A'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.estado}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button onClick={() => handleEditUserEpsClick(user)} style={{ marginRight: '5px' }}>Editar</button>
                        <button onClick={() => handleDeleteUserEps(user.idUsuarioPorEps)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay usuarios por EPS registrados.</p>
            )
          )}
        </section>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default AdminCentralDashboard;