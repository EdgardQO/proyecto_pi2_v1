import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import EpsDetail from './EpsDetail';
import axios from 'axios'; // Asegúrate de que axios esté importado

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
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState(false);
  const [rolesEps, setRolesEps] = useState([]);
  const [rolesSistema, setRolesSistema] = useState([]);
  const [usuarioEpsRoleId, setUsuarioEpsRoleId] = useState(null);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Efecto para cargar los detalles de la EPS al inicio
  useEffect(() => {
    const fetchEpsDetails = async () => {
      if (user && typeof user.idEps === 'number' && user.idEps > 0) {
        try {
          // --- CAMBIO AQUÍ: Usar axios.get en lugar de fetch ---
          const response = await axios.get(`http://localhost:8080/api/eps/my-eps?id=${user.idEps}`);
          // Ya no necesitas 'credentials: include' con axios y el interceptor JWT
          // --- FIN CAMBIO ---

          setEpsDetails(response.data);
          setError(null); // Limpia cualquier error previo si la carga es exitosa
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

  // ... (el resto del código de AdminEpsDashboard.jsx permanece igual) ...

  const fetchUsuariosEps = async () => {
    if (user && typeof user.idEps === 'number' && user.idEps > 0) {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/usuarios-eps/by-eps/${user.idEps}`); // Esto ya usaba axios
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
      const rolesEpsResponse = await axios.get('http://localhost:8080/api/roles-eps'); // Esto ya usaba axios
      setRolesEps(rolesEpsResponse.data);
      const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema'); // Esto ya usaba axios
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
    setShowUserForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleEditUserClick = (userToEdit) => {
    setCurrentUser(userToEdit);
    setShowUserForm(true);
    setFormMessage('');
    setFormError(false);
  };

  const handleDeleteUser = async (idUsuarioPorEps) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:8080/api/usuarios-eps/${idUsuarioPorEps}`); // Esto ya usaba axios
        setFormMessage('Usuario eliminado exitosamente.');
        setFormError(false);
        fetchUsuariosEps();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setFormMessage(`Error al eliminar usuario: ${error.response?.data || error.message}`);
        setFormError(true);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormMessage('');
    setFormError(false);
    try {
      if (currentUser) {
        await axios.put('http://localhost:8080/api/usuarios-eps', formData); // Esto ya usaba axios
        setFormMessage('Usuario actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:8080/api/usuarios-eps', formData); // Esto ya usaba axios
        setFormMessage('Usuario añadido exitosamente.');
      }
      setFormError(false);
      setShowUserForm(false);
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
    <div>
      <h1>Panel de Administrador EPS ✅</h1>
      <p>Bienvenido, {user.fullName || user.username}. Tienes los roles: {user.roles.join(', ')}.</p>

      <h3>Gestión de su EPS</h3>
      {loadingEps ? (
        <p>Cargando detalles de la EPS...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <EpsDetail eps={epsDetails} />
      )}

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button onClick={fetchUsuariosEps} style={{ marginRight: '10px' }}>
          Ver Usuarios de mi EPS
        </button>
        <button onClick={handleAddUserClick} disabled={loadingRoles || usuarioEpsRoleId === null}>
          Agregar Nuevo Usuario
        </button>
        {loadingRoles && <p>Cargando roles del sistema...</p>}
        {usuarioEpsRoleId === null && !loadingRoles && (
            <p style={{ color: 'orange' }}>Advertencia: El rol 'USUARIO_EPS' no se pudo cargar. No podrás agregar usuarios hasta que se resuelva.</p>
        )}
      </div>

      {showUserForm && usuarioEpsRoleId !== null && (
        <UserForm
          user={currentUser}
          idEps={user.idEps}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowUserForm(false)}
          rolesEps={rolesEps}
          usuarioEpsRoleId={usuarioEpsRoleId}
          message={formMessage}
          isError={formError}
        />
      )}

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
                      <button onClick={() => handleEditUserClick(usuario)} style={{ marginRight: '5px' }}>Editar</button>
                      <button onClick={() => handleDeleteUser(usuario.idUsuarioPorEps)}>Eliminar</button>
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

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

// Componente de formulario para añadir/editar usuario
function UserForm({ user, idEps, onSubmit, onCancel, rolesEps, usuarioEpsRoleId, message, isError }) {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Asegura que idRolSistema siempre tenga un valor numérico válido si usuarioEpsRoleId está disponible
  const initialIdRolSistema = user?.rolSistema?.idRolSistema || (usuarioEpsRoleId !== null ? usuarioEpsRoleId : '');

  const [formData, setFormData] = useState({
    idUsuarioPorEps: user?.idUsuarioPorEps || null,
    idRolEps: user?.rolEps?.idRolEps || '',
    idEps: idEps, // Se establece automáticamente el ID de la EPS del administrador
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    contrasena: '', // No se precarga la contraseña por seguridad
    dni: user?.dni || '',
    rutaFoto: user?.rutaFoto || '',
    areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
    estado: user?.estado || 'ACTIVO',
    idRolSistema: initialIdRolSistema, // Asignar el ID del rol de sistema directamente
  });

  useEffect(() => {
    // Si estamos editando un usuario existente, usar su idRolSistema. Si es nuevo, usar el predefinido.
    // Usamos usuarioEpsRoleId de las props si no hay user o user.rolSistema.idRolSistema
    const currentIdRolSistema = user?.rolSistema?.idRolSistema || (usuarioEpsRoleId !== null ? usuarioEpsRoleId : '');

    setFormData({
      idUsuarioPorEps: user?.idUsuarioPorEps || null,
      idRolEps: user?.rolEps?.idRolEps || '',
      idEps: idEps,
      nombres: user?.nombres || '',
      apellidos: user?.apellidos || '',
      contrasena: '', // Siempre vacío para edición, se gestiona en el backend si se cambia
      dni: user?.dni || '',
      rutaFoto: user?.rutaFoto || '',
      areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
      estado: user?.estado || 'ACTIVO',
      idRolSistema: currentIdRolSistema,
    });
  }, [user, idEps, usuarioEpsRoleId]); // Añadir usuarioEpsRoleId a las dependencias

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones básicas antes de enviar
    if (!formData.idRolEps || !formData.nombres || !formData.apellidos || !formData.dni || !formData.estado || formData.idRolSistema === null || formData.idRolSistema === '') {
      alert('Por favor, completa todos los campos obligatorios (Rol EPS, Nombres, Apellidos, DNI, Estado) y asegúrate de que el Rol Sistema esté cargado.');
      return;
    }
    // La contraseña es obligatoria solo para nuevos usuarios
    if (!user && !formData.contrasena) {
      alert('Para un nuevo usuario, la contraseña es obligatoria.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left' }}>
      <h3>{user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombres:</label>
          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Apellidos:</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>DNI (Usuario):</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        
        {/* Campo de Contraseña con toggle de visibilidad */}
        <div style={{ marginBottom: '10px', position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required={!user} // Requerido solo si es un nuevo usuario
            style={{ width: 'calc(100% - 40px)', padding: '8px', boxSizing: 'border-box', paddingRight: '35px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0',
              top: '25px', // Ajusta según el diseño
              padding: '8px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontSize: '1.2em',
              lineHeight: '1',
              color: '#666'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Ruta Foto (Opcional):</label>
          <input type="text" name="rutaFoto" value={formData.rutaFoto} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Área (Opcional):</label>
          <input type="text" name="areaUsuarioCaracter" value={formData.areaUsuarioCaracter} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Estado:</label>
          <select name="estado" value={formData.estado} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rol en EPS:</label>
          <select name="idRolEps" value={formData.idRolEps} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">Selecciona un rol EPS</option>
            {rolesEps.map(rol => (
              <option key={rol.idRolEps} value={rol.idRolEps}>{rol.nombreRol}</option>
            ))}
          </select>
        </div>
        {/* Campo de Rol en el Sistema (solo muestra el valor, no es editable) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rol en el Sistema:</label>
          <input
            type="text"
            name="rolSistemaDisplay" // Un nombre diferente para no interferir con idRolSistema
            value={'USUARIO_EPS'} // Siempre muestra 'USUARIO_EPS'
            disabled // Hace el campo no editable
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#e9e9e9' }}
          />
          {/* Un campo oculto para enviar el ID real del rol de sistema */}
          <input type="hidden" name="idRolSistema" value={formData.idRolSistema} />
        </div>

        {message && (
          <p style={{ color: isError ? 'red' : 'green', marginBottom: '10px' }}>
            {message}
          </p>
        )}

        <button type="submit" style={{ marginRight: '10px' }}>
          {user ? 'Guardar Cambios' : 'Añadir Usuario'}
        </button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default AdminEpsDashboard;