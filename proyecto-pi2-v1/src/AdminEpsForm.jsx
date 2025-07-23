import React, { useState, useEffect } from 'react';

function AdminEpsForm({ adminEps, onSubmit, onCancel, adminEpsRoleId, epsOptions, message, isError }) {
const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
idAdminEps: adminEps?.idAdminEps || null,
id_eps: adminEps?.eps?.idEps || '', // ID de la EPS a la que pertenece
dni: adminEps?.dni || '',
apellidos: adminEps?.apellidos || '',
nombres: adminEps?.nombres || '',
telefono: adminEps?.telefono || '',
correo: adminEps?.correo || '',
contrasena: '', // Nunca precargar la contraseña
rutaFoto: adminEps?.rutaFoto || '',
estado: adminEps?.estado || 'ACTIVO',
idRolSistema: adminEps?.rolSistema?.idRolSistema || adminEpsRoleId, // Asignar el ID del rol ADMIN_EPS
});

useEffect(() => {
// Actualiza formData cuando `adminEps` o `adminEpsRoleId` cambian
const currentIdRolSistema = adminEps?.rolSistema?.idRolSistema || adminEpsRoleId;
setFormData({
    idAdminEps: adminEps?.idAdminEps || null,
    id_eps: adminEps?.eps?.idEps || '',
    dni: adminEps?.dni || '',
    apellidos: adminEps?.apellidos || '',
    nombres: adminEps?.nombres || '',
    telefono: adminEps?.telefono || '',
    correo: adminEps?.correo || '',
    contrasena: '', // Siempre vacío para seguridad
    rutaFoto: adminEps?.rutaFoto || '',
    estado: adminEps?.estado || 'ACTIVO',
    idRolSistema: currentIdRolSistema,
});
}, [adminEps, adminEpsRoleId]);

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
e.preventDefault();
// Validaciones básicas
if (!formData.id_eps || !formData.dni || !formData.apellidos || !formData.nombres || !formData.correo || !formData.estado || formData.idRolSistema === null || formData.idRolSistema === '') {
    alert('Por favor, completa todos los campos obligatorios (EPS, DNI, Nombres, Apellidos, Correo, Estado) y asegúrate de que el Rol Sistema esté cargado.');
    return;
}
if (!adminEps && !formData.contrasena) { // Contraseña obligatoria solo para nuevos admins
    alert('Para un nuevo Administrador de EPS, la contraseña es obligatoria.');
    return;
}
onSubmit(formData);
};

return (
<div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left' }}>
    <h3>{adminEps ? 'Editar Administrador de EPS' : 'Agregar Nuevo Administrador de EPS'}</h3>
    <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>EPS Asociada:</label>
        <select name="id_eps" value={formData.id_eps} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
        <option value="">Selecciona una EPS</option>
        {epsOptions.map(eps => (
            <option key={eps.idEps} value={eps.idEps}>{eps.nombreEps}</option>
        ))}
        </select>
    </div>
    <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>DNI:</label>
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
    <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Teléfono (Opcional):</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="9" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
    </div>
    <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Correo:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
    </div>
    
    {/* Campo de Contraseña con toggle de visibilidad */}
    <div style={{ marginBottom: '10px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña {adminEps ? '(dejar vacío para no cambiar)' : '*'}:</label>
        <input
        type={showPassword ? "text" : "password"}
        name="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        required={!adminEps} // Requerido solo si es un nuevo admin
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Estado:</label>
        <select name="estado" value={formData.estado} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
        <option value="ACTIVO">ACTIVO</option>
        <option value="INACTIVO">INACTIVO</option>
        </select>
    </div>
    
    {/* Campo de Rol en el Sistema (solo muestra el valor, no es editable) */}
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Rol en el Sistema:</label>
        <input
        type="text"
        name="rolSistemaDisplay"
        value={'ADMIN_EPS'} // Siempre muestra 'ADMIN_EPS'
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
        {adminEps ? 'Guardar Cambios' : 'Añadir Administrador EPS'}
    </button>
    <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
</div>
);
}

export default AdminEpsForm;