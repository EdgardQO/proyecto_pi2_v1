// src/UserEpsForm.jsx
import React, { useState, useEffect } from 'react';

// Componente de formulario para añadir/editar usuario
// Props:
// user: Objeto de usuario si se está editando, null si se está añadiendo
// onSubmit: Función a llamar al enviar el formulario
// onCancel: Función a llamar al cancelar el formulario
// idEpsOptions: Array de objetos EPS para el dropdown de selección de EPS
// rolesEpsOptions: Array de objetos RolEpsEntity para el dropdown de roles de EPS
// usuarioEpsRoleId: ID del rol de sistema 'USUARIO_EPS' (para asignar automáticamente)
// message: Mensaje de retroalimentación
// isError: Booleano para indicar si el mensaje es un error
function UserEpsForm({ user, onSubmit, onCancel, idEpsOptions, rolesEpsOptions, usuarioEpsRoleId, message, isError }) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    idUsuarioPorEps: user?.idUsuarioPorEps || null,
    idRolEps: user?.rolEps?.idRolEps || '',
    idEps: user?.eps?.idEps || '', // Ahora se seleccionará de idEpsOptions
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    contrasena: '',
    dni: user?.dni || '',
    rutaFoto: user?.rutaFoto || '',
    areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
    estado: user?.estado || 'ACTIVO',
    idRolSistema: user?.rolSistema?.idRolSistema || usuarioEpsRoleId,
  });

  useEffect(() => {
    const currentIdRolSistema = user?.rolSistema?.idRolSistema || usuarioEpsRoleId;
    setFormData({
      idUsuarioPorEps: user?.idUsuarioPorEps || null,
      idRolEps: user?.rolEps?.idRolEps || '',
      idEps: user?.eps?.idEps || '',
      nombres: user?.nombres || '',
      apellidos: user?.apellidos || '',
      contrasena: '',
      dni: user?.dni || '',
      rutaFoto: user?.rutaFoto || '',
      areaUsuarioCaracter: user?.areaUsuarioCaracter || '',
      estado: user?.estado || 'ACTIVO',
      idRolSistema: currentIdRolSistema,
    });
  }, [user, usuarioEpsRoleId, idEpsOptions, rolesEpsOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Conversión de ID a número para campos select que representan IDs
    if (name === 'idRolEps' || name === 'idEps') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones
    if (!formData.idRolEps || !formData.nombres || !formData.apellidos || !formData.dni || !formData.estado || formData.idRolSistema === null || formData.idRolSistema === '' || !formData.idEps || isNaN(formData.idEps) || formData.idEps === '') {
      alert('Por favor, completa todos los campos obligatorios (EPS, Rol EPS, Nombres, Apellidos, DNI, Estado) y asegúrate de que el Rol Sistema esté cargado.');
      return;
    }
    if (!user && !formData.contrasena) {
      alert('Para un nuevo usuario, la contraseña es obligatoria.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left' }}>
      <h3>{user ? 'Editar Usuario EPS' : 'Agregar Nuevo Usuario EPS'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>EPS Asociada:</label>
          <select name="idEps" value={formData.idEps} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">Selecciona una EPS</option>
            {idEpsOptions.map(eps => (
              <option key={eps.idEps} value={eps.idEps}>{eps.nombreEps}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>DNI (Usuario):</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} required maxLength="8" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombres:</label>
          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Apellidos:</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        {/* Campo de Contraseña con toggle de visibilidad */}
        <div style={{ marginBottom: '10px', position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required={!user}
            style={{ width: 'calc(100% - 40px)', padding: '8px', boxSizing: 'border-box', paddingRight: '35px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0',
              top: '25px',
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
            {rolesEpsOptions.map(rol => (
              <option key={rol.idRolEps} value={rol.idRolEps}>{rol.nombreRol}</option>
            ))}
          </select>
        </div>
        {/* Campo de Rol en el Sistema (solo muestra el valor, no es editable) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rol en el Sistema:</label>
          <input
            type="text"
            name="rolSistemaDisplay"
            value={'USUARIO_EPS'}
            disabled
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#e9e9e9' }}
          />
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

export default UserEpsForm;