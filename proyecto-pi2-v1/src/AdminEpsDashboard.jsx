import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail';
import axios from 'axios';

function AdminEpsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [epsDetails, setEpsDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingEps, setLoadingEps] = useState(true);
  const [usuariosEps, setUsuariosEps] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState(null);

  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const [formData, setFormData] = useState({
    idUsuarioPorEps: null,
    nombres: '',
    apellidos: '',
    dni: '',
    contrasena: '',
    rutaFoto: '',
    areaUsuarioCaracter: '',
    estado: 'ACTIVO',
    idRolEps: '', // Mantener como string inicialmente para el select
    idRolSistema: '', // Mantener como string inicialmente para el select
    idEps: null
  });
  const [formError, setFormError] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  const [rolesEps, setRolesEps] = useState([]);
  const [rolesSistema, setRolesSistema] = useState([]);


  useEffect(() => {
    const fetchInitialData = async () => {
      if (user && typeof user.idEps === 'number' && user.idEps > 0) {
        try {
          const response = await axios.get(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`, {
            withCredentials: true
          });
          setEpsDetails(response.data);
        } catch (err) {
          console.error("Error al cargar detalles de EPS:", err);
          setError("No se pudo conectar al servidor o cargar los detalles de la EPS.");
        } finally {
          setLoadingEps(false);
        }
      } else {
        setLoadingEps(false);
        setError("ID de EPS no disponible o inválido para este usuario.");
      }

      // Cargar roles para el formulario
      try {
        const rolesEpsResponse = await axios.get('http://localhost:8080/api/roles-eps', { withCredentials: true });
        console.log("Roles EPS cargados:", rolesEpsResponse.data); // ✅ MUY IMPORTANTE: ¡Ver esta salida!
        setRolesEps(rolesEpsResponse.data);

        const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema', { withCredentials: true });
        console.log("Roles Sistema cargados:", rolesSistemaResponse.data); // ✅ MUY IMPORTANTE: ¡Ver esta salida!
        setRolesSistema(rolesSistemaResponse.data);
      } catch (err) {
        console.error("Error al cargar roles:", err);
        setFormError(`No se pudieron cargar los roles para el formulario. Detalle: ${err.response?.data?.message || err.message}`);
      }
    };

    fetchInitialData();
  }, [user]);

  const fetchUsuariosEps = async () => {
    if (user && typeof user.idEps === 'number' && user.idEps > 0) {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/usuarios-eps/by-eps/${user.idEps}`, {
          withCredentials: true
        });
        setUsuariosEps(response.data);
      } catch (err) {
        console.error("Error de red o al cargar usuarios de EPS:", err);
        setErrorUsuarios("No se pudo conectar al servidor o no tiene permisos para obtener los usuarios de la EPS.");
      } finally {
        setLoadingUsuarios(false);
      }
    } else {
      setErrorUsuarios("ID de EPS no disponible para cargar usuarios.");
    }
  };

  useEffect(() => {
    if (epsDetails) {
      fetchUsuariosEps();
    }
  }, [epsDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // ✅ CAMBIO: Convertir a número para idRolEps y idRolSistema si no están vacíos
    if (name === 'idRolEps' || name === 'idRolSistema') {
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : parseInt(value, 10) // Guardar como número o cadena vacía
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = () => {
    setFormMode('add');
    setCurrentUser(null);
    setFormData({
      idUsuarioPorEps: null,
      nombres: '',
      apellidos: '',
      dni: '',
      contrasena: '',
      rutaFoto: '',
      areaUsuarioCaracter: '',
      estado: 'ACTIVO',
      idRolEps: '',
      idRolSistema: '',
      idEps: user.idEps
    });
    setFormError(null);
    setFormMessage(null);
    setShowUserForm(true);
  };

  const handleEditUser = (userToEdit) => {
    setFormMode('edit');
    setCurrentUser(userToEdit);
    setFormData({
      idUsuarioPorEps: userToEdit.idUsuarioPorEps,
      nombres: userToEdit.nombres,
      apellidos: userToEdit.apellidos,
      dni: userToEdit.dni,
      contrasena: '',
      rutaFoto: userToEdit.rutaFoto || '',
      areaUsuarioCaracter: userToEdit.areaUsuarioCaracter || '',
      estado: userToEdit.estado,
      // Los valores deben ser el ID numérico o cadena vacía para que el select los preseleccione
      idRolEps: userToEdit.rolEps?.idRolEps || '',
      idRolSistema: userToEdit.rolSistema?.idRolSistema || '',
      idEps: userToEdit.idEps
    });
    setFormError(null);
    setFormMessage(null);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (idUser) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/usuarios-eps/${idUser}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setFormMessage('Usuario eliminado exitosamente.');
          fetchUsuariosEps();
        } else {
          setFormError('Error al eliminar el usuario.');
        }
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido al eliminar el usuario.';
        setFormError(`Error al eliminar el usuario: ${errorMessage}`);
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormMessage(null);

    // ✅ Importante: Asegurar que los IDs de rol sean números o null/undefined si es que no se seleccionó nada
    const dataToSend = {
        ...formData,
        idRolEps: formData.idRolEps === '' ? null : parseInt(formData.idRolEps, 10),
        idRolSistema: formData.idRolSistema === '' ? null : parseInt(formData.idRolSistema, 10),
    };


    if (!dataToSend.nombres || !dataToSend.apellidos || !dataToSend.dni || !dataToSend.estado || dataToSend.idRolEps === null || dataToSend.idRolSistema === null) {
      setFormError('Por favor, completa todos los campos obligatorios: Nombres, Apellidos, DNI, Estado, Rol en EPS y Rol de Sistema.');
      return;
    }
    if (formMode === 'add' && !dataToSend.contrasena) {
      setFormError('La contraseña es obligatoria para nuevos usuarios.');
      return;
    }

    try {
      const method = formMode === 'add' ? 'post' : 'put';
      const url = `http://localhost:8080/api/usuarios-eps`;

      const response = await axios[method](url, dataToSend, { // ✅ Usar dataToSend
        withCredentials: true
      });

      if (response.status === 200) {
        setFormMessage(`Usuario ${formMode === 'add' ? 'añadido' : 'actualizado'} exitosamente.`);
        setShowUserForm(false);
        fetchUsuariosEps();
      } else {
        setFormError(`Error al ${formMode === 'add' ? 'añadir' : 'actualizar'} el usuario.`);
      }
    } catch (err) {
      console.error(`Error al ${formMode === 'add' ? 'añadir' : 'actualizar'} usuario:`, err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido.';
      setFormError(`Error al ${formMode === 'add' ? 'añadir' : 'actualizar'} el usuario: ${errorMessage}`);
    }
  };

  const handleCancelForm = () => {
    setShowUserForm(false);
    setFormError(null);
    setFormMessage(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Acceso denegado.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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

      <button onClick={handleAddUser} style={{ marginTop: '20px', marginBottom: '20px', marginRight: '10px' }}>
        Añadir Nuevo Usuario
      </button>

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
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Acciones</th>
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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button onClick={() => handleEditUser(usuario)} style={{ marginRight: '5px' }}>Editar</button>
                      <button onClick={() => handleDeleteUser(usuario.idUsuarioPorEps)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Eliminar</button>
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

      {showUserForm && (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
          <h3>{formMode === 'add' ? 'Añadir Nuevo Usuario' : 'Editar Usuario'}</h3>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {formMessage && <p style={{ color: 'green' }}>{formMessage}</p>}
          <form onSubmit={handleSubmitForm}>
            {formMode === 'edit' && (
              <div style={{ marginBottom: '10px' }}>
                <label>ID Usuario:</label>
                <input type="text" name="idUsuarioPorEps" value={formData.idUsuarioPorEps || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
              </div>
            )}
            <div style={{ marginBottom: '10px' }}>
              <label>DNI:</label>
              <input type="text" name="dni" value={formData.dni} onChange={handleInputChange} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Nombres:</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Apellidos:</label>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Contraseña {formMode === 'edit' ? '(dejar vacío para no cambiar)' : ''}:</label>
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Ruta Foto (opcional):</label>
              <input type="text" name="rutaFoto" value={formData.rutaFoto} onChange={handleInputChange} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Área (opcional):</label>
              <input type="text" name="areaUsuarioCaracter" value={formData.areaUsuarioCaracter} onChange={handleInputChange} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Estado:</label>
              <select name="estado" value={formData.estado} onChange={handleInputChange} required>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Rol en EPS:</label>
              <select name="idRolEps" value={formData.idRolEps} onChange={handleInputChange} required>
                <option value="">Seleccione un rol...</option>
                {/* ✅ IMPORTANTE: Eliminadas las opciones <option> insertadas manualmente */}
                {rolesEps.map(rol => (
                  <option key={rol.idRolEps} value={rol.idRolEps}>{rol.nombreRol}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Rol de Sistema:</label>
              <select name="idRolSistema" value={formData.idRolSistema} onChange={handleInputChange} required>
                <option value="">Seleccione un rol...</option>
                {/* ✅ IMPORTANTE: Eliminadas las opciones <option> insertadas manualmente */}
                {rolesSistema.map(rol => (
                  <option key={rol.idRolSistema} value={rol.idRolSistema}>{rol.nombreRol}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ marginRight: '10px' }}>{formMode === 'add' ? 'Añadir Usuario' : 'Actualizar Usuario'}</button>
            <button type="button" onClick={handleCancelForm} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancelar</button>
          </form>
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default AdminEpsDashboard;