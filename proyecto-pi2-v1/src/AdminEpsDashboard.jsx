import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail';
import axios from 'axios';
import './AdminEpsDashboard.css';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

function UserFormModal({ isOpen, onClose, ...props }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <UserForm {...props} onCancel={onClose} />
        </Modal>
    );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="confirmation-modal-content">
            <h3>Confirmación</h3>
            <p>{message}</p>
            <div className="confirmation-modal-actions">
                <button className="secondary-button" onClick={onConfirm}>{confirmText}</button>
                <button className="cancel-button" onClick={onClose}>{cancelText}</button>
            </div>
        </Modal>
    );
}

function AdminEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);
  const [usuariosEps, setUsuariosEps] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState(null);

  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null); // ID del usuario a eliminar

  const [currentUser, setCurrentUser] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState(false);
  const [rolesEps, setRolesEps] = useState([]);
  const [rolesSistema, setRolesSistema] = useState([]);
  const [usuarioEpsRoleId, setUsuarioEpsRoleId] = useState(null);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchEpsDetails = async () => {
      if (user && typeof user.idEps === 'number' && user.idEps > 0) {
        try {
          const response = await axios.get(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`);
          setEpsDetails(response.data);
          setError(null);
        } catch (err) {
          console.error("Error al cargar los detalles de la EPS:", err);
          setError("No se pudo conectar al servidor para obtener los detalles de la EPS. Asegúrate de que el backend está corriendo y el token es válido.");
        } finally {
          setLoadingEps(false);
        }
      } else {
        setLoadingEps(false);
        setError("ID de EPS no disponible o inválido para este usuario. Asegúrate de que el usuario esté correctamente asociado a una EPS.");
      }
    };

    fetchEpsDetails();
    fetchRoles();
    fetchUsuariosEps();
  }, [user]);

  const fetchUsuariosEps = async () => {
    if (user && typeof user.idEps === 'number' && user.idEps > 0) {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/usuarios-eps/by-eps/${user.idEps}`);
        setUsuariosEps(response.data);
      } catch (err) {
        console.error("Error al cargar usuarios de EPS:", err);
        setErrorUsuarios("No se pudo conectar al servidor para obtener los usuarios de la EPS. Asegúrate de que el backend está corriendo.");
      } finally {
        setLoadingUsuarios(false);
      }
    } else {
      setErrorUsuarios("ID de EPS no disponible para cargar usuarios.");
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const rolesEpsResponse = await axios.get('http://localhost:8080/api/roles-eps');
      setRolesEps(rolesEpsResponse.data);
      const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema');
      setRolesSistema(rolesSistemaResponse.data);

      const usuarioRol = rolesSistemaResponse.data.find(rol => rol.nombreRol === 'USUARIO_EPS');
      if (usuarioRol) {
        setUsuarioEpsRoleId(usuarioRol.idRolSistema);
      } else {
        console.warn("Rol 'USUARIO_EPS' no encontrado en el sistema. Asegúrate de que existe en tu base de datos y backend.");
        setFormMessage("Advertencia: El rol 'USUARIO_EPS' no está disponible en el backend. Los nuevos usuarios no se podrán guardar correctamente.");
        setFormError(true);
        setUsuarioEpsRoleId(null);
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
      setFormMessage("Error al cargar roles del sistema o EPS para el formulario.");
      setFormError(true);
      setUsuarioEpsRoleId(null);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddUserClick = () => {
    setCurrentUser(null);
    setIsUserFormModalOpen(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleEditUserClick = (userToEdit) => {
    setCurrentUser(userToEdit);
    setIsUserFormModalOpen(true);
    setFormMessage('');
    setFormError(false);
  };

  const confirmDeleteUser = (idUsuarioPorEps) => {
    setUserToDeleteId(idUsuarioPorEps);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    setIsConfirmationModalOpen(false);
    if (userToDeleteId) {
      try {
        await axios.delete(`http://localhost:8080/api/usuarios-eps/${userToDeleteId}`);
        setFormMessage('Usuario eliminado exitosamente.');
        setFormError(false);
        fetchUsuariosEps();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setFormMessage(`Error al eliminar usuario: ${error.response?.data || error.message}`);
        setFormError(true);
      } finally {
        setUserToDeleteId(null);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormMessage('');
    setFormError(false);
    try {
      if (currentUser) {
        await axios.put('http://localhost:8080/api/usuarios-eps', formData);
        setFormMessage('Usuario actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/usuarios-eps', formData);
        setFormMessage('Usuario añadido exitosamente.');
      }
      setFormError(false);
      setIsUserFormModalOpen(false);
      fetchUsuariosEps();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      let errorMessage = 'Error desconocido al guardar usuario.';
      if (axios.isAxiosError(error) && error.response) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          errorMessage = JSON.stringify(error.response.data);
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = `Error de servidor: ${error.response.status} - ${error.response.statusText}`;
        }
      } else if (error.message) {
        errorMessage = `Error de red: ${error.message}`;
      }
      setFormMessage(`Error al guardar usuario: ${errorMessage}`);
      setFormError(true);
    }
  };

  if (!user) {
    return <div>Acceso denegado.</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Administrador EPS</h1>
        <div className={`user-menu-container ${isUserMenuOpen ? 'active' : ''}`} ref={userMenuRef}>
          <button className="user-info-button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <span>Hola, {user.fullName || user.username}</span>
          </button>
          {isUserMenuOpen && (
            <div className="dropdown-menu">
              <div className="user-roles">
                Roles: {user.roles.join(', ')}
              </div>
              <button onClick={handleLogout}>Cerrar Sesión</button>
              <button onClick={() => navigate('/')}>Ir a la página principal</button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="left-panel">
          <div className="eps-detail-section">
            <h3>Gestión de su EPS</h3>
            {loadingEps ? (
              <p className="message-info">Cargando detalles de la EPS...</p>
            ) : error ? (
              <p className="message-error">{error}</p>
            ) : (
              <EpsDetail eps={epsDetails} />
            )}
          </div>

          <div className="action-buttons-group">
            <button className="primary-button" onClick={fetchUsuariosEps}>
              Recargar Usuarios de mi EPS
            </button>
            <button
              className="primary-button"
              onClick={handleAddUserClick}
              disabled={loadingRoles || usuarioEpsRoleId === null}
            >
              Agregar Nuevo Usuario
            </button>
          </div>
          {loadingRoles && <p className="message-info">Cargando roles del sistema...</p>}
          {usuarioEpsRoleId === null && !loadingRoles && (
            <p className="message-warning">Advertencia: El rol 'USUARIO_EPS' no se pudo cargar. No podrás agregar usuarios hasta que se resuelva.</p>
          )}

          {formMessage && (
            <p className={formError ? 'message-error' : 'message-success'}>
              {formMessage}
            </p>
          )}
        </section>

        <section className="right-panel users-table-section">
          <h3>Usuarios Pertenecientes a mi EPS</h3>
          {loadingUsuarios ? (
            <p className="message-info">Cargando usuarios...</p>
          ) : errorUsuarios ? (
            <p className="message-error">{errorUsuarios}</p>
          ) : (
            usuariosEps.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DNI</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Estado</th>
                    <th>Rol EPS</th>
                    <th>Rol Sistema</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosEps.map(usuario => (
                    <tr key={usuario.idUsuarioPorEps}>
                      <td>{usuario.idUsuarioPorEps}</td>
                      <td>{usuario.dni}</td>
                      <td>{usuario.nombres}</td>
                      <td>{usuario.apellidos}</td>
                      <td>{usuario.estado}</td>
                      <td>{usuario.rolEps?.nombreRol || 'N/A'}</td>
                      <td>{usuario.rolSistema?.nombreRol || 'N/A'}</td>
                      <td>
                        <div className="action-buttons-table">
                          <button onClick={() => handleEditUserClick(usuario)}>Editar</button>
                          <button onClick={() => confirmDeleteUser(usuario.idUsuarioPorEps)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay usuarios registrados para esta EPS.</p>
            )
          )}
        </section>
      </main>

      {usuarioEpsRoleId !== null && (
        <UserFormModal
          isOpen={isUserFormModalOpen}
          onClose={() => setIsUserFormModalOpen(false)}
          user={currentUser}
          idEps={user.idEps}
          onSubmit={handleFormSubmit}
          rolesEps={rolesEps}
          usuarioEpsRoleId={usuarioEpsRoleId}
          message={formMessage}
          isError={formError}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        message="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
      />
    </div>
  );
}
function UserForm({ user, idEps, onSubmit, onCancel, rolesEps, usuarioEpsRoleId, message, isError }) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    idUsuarioPorEps: user?.idUsuarioPorEps || null,
    idRolEps: user?.rolEps?.idRolEps || '',
    idEps: idEps,
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    contrasena: '',
    dni: user?.dni || '',
    rutaFoto: user?.rutaFoto || '',
    areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
    estado: user?.estado || 'ACTIVO',
    idRolSistema: user?.rolSistema?.idRolSistema || (usuarioEpsRoleId !== null ? usuarioEpsRoleId : ''),
  });

  useEffect(() => {
    setFormData({
      idUsuarioPorEps: user?.idUsuarioPorEps || null,
      idRolEps: user?.rolEps?.idRolEps || '',
      idEps: idEps,
      nombres: user?.nombres || '',
      apellidos: user?.apellidos || '',
      contrasena: '',
      dni: user?.dni || '',
      rutaFoto: user?.rutaFoto || '',
      areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
      estado: user?.estado || 'ACTIVO',
      idRolSistema: user?.rolSistema?.idRolSistema || (usuarioEpsRoleId !== null ? usuarioEpsRoleId : ''),
    });
  }, [user, idEps, usuarioEpsRoleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.idRolEps || !formData.nombres || !formData.apellidos || !formData.dni || !formData.estado || formData.idRolSistema === null || formData.idRolSistema === '') {
      alert('Por favor, completa todos los campos obligatorios (Rol EPS, Nombres, Apellidos, DNI, Estado) y asegúrate de que el Rol Sistema esté cargado.');
      return;
    }
    if (!user && !formData.contrasena) {
      alert('Para un nuevo usuario, la contraseña es obligatoria.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="user-form-content">
      <h3>{user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombres:</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apellidos:</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>DNI (Usuario):</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
          </div>

          <div className="form-group password-input-wrapper">
            <label>Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required={!user}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-button"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="form-group full-width">
            <label>Ruta Foto (Opcional):</label>
            <input type="text" name="rutaFoto" value={formData.rutaFoto} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Área (Opcional):</label>
            <input type="text" name="areaUsuarioCaracter" value={formData.areaUsuarioCaracter} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rol en EPS:</label>
            <select name="idRolEps" value={formData.idRolEps} onChange={handleChange} required>
              <option value="">Selecciona un rol EPS</option>
              {rolesEps.map(rol => (
                <option key={rol.idRolEps} value={rol.idRolEps}>{rol.nombreRol}</option>
              ))}
            </select>
          </div>
          <div className="form-group full-width">
            <label>Rol en el Sistema:</label>
            <input
              type="text"
              value={'USUARIO_EPS'}
              disabled
              style={{ backgroundColor: '#e9e9e9' }}
            />
            <input type="hidden" name="idRolSistema" value={formData.idRolSistema} />
          </div>
        </div>

        {message && (
          <p className={isError ? 'message-error' : 'message-success'}>
            {message}
          </p>
        )}

        <div className="form-buttons">
          <button type="submit" className="primary-button">
            {user ? 'Guardar Cambios' : 'Añadir Usuario'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
export default AdminEpsDashboard;