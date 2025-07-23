import React, { useState, useEffect } from 'react';

function UserEpsForm({ user, onSubmit, onCancel, idEpsOptions, rolesEpsOptions, usuarioEpsRoleId, message, isError }) {
const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
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
    if (name === 'idRolEps' || name === 'idEps') {
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
    } else {
    setFormData(prev => ({ ...prev, [name]: value }));
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
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
    <div className="modal-form-content">
    <h3>{user ? 'Editar Usuario EPS' : 'Agregar Nuevo Usuario EPS'}</h3>
    <form onSubmit={handleSubmit}>
        <div className="form-grid">
        <div className="form-group full-width">
            <label>EPS Asociada:</label>
            <select name="idEps" value={formData.idEps} onChange={handleChange} required>
            <option value="">Selecciona una EPS</option>
            {idEpsOptions.map(eps => (
                <option key={eps.idEps} value={eps.idEps}>{eps.nombreEps}</option>
            ))}
            </select>
        </div>
        <div className="form-group">
            <label>DNI (Usuario):</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} required maxLength="8" />
        </div>
        <div className="form-group">
            <label>Nombres:</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
        </div>
        <div className="form-group">
            <label>Apellidos:</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
        </div>

        <div className="form-group password-input-wrapper full-width">
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
        <div className="form-group">
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
            {rolesEpsOptions.map(rol => (
                <option key={rol.idRolEps} value={rol.idRolEps}>{rol.nombreRol}</option>
            ))}
            </select>
        </div>
        <div className="form-group full-width">
            <label>Rol en el Sistema:</label>
            <input
            type="text"
            name="rolSistemaDisplay"
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

export default UserEpsForm;