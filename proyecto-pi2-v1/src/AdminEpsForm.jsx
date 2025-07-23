import React, { useState, useEffect } from 'react';

function AdminEpsForm({ adminEps, onSubmit, onCancel, adminEpsRoleId, epsOptions, message, isError }) {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        idAdminEps: adminEps?.idAdminEps || null,
        id_eps: adminEps?.eps?.idEps || '',
        dni: adminEps?.dni || '',
        apellidos: adminEps?.apellidos || '',
        nombres: adminEps?.nombres || '',
        telefono: adminEps?.telefono || '',
        correo: adminEps?.correo || '',
        contrasena: '',
        rutaFoto: adminEps?.rutaFoto || '',
        estado: adminEps?.estado || 'ACTIVO',
        idRolSistema: adminEps?.rolSistema?.idRolSistema || adminEpsRoleId,
    });

    useEffect(() => {
        const currentIdRolSistema = adminEps?.rolSistema?.idRolSistema || adminEpsRoleId;
        setFormData({
            idAdminEps: adminEps?.idAdminEps || null,
            id_eps: adminEps?.eps?.idEps || '',
            dni: adminEps?.dni || '',
            apellidos: adminEps?.apellidos || '',
            nombres: adminEps?.nombres || '',
            telefono: adminEps?.telefono || '',
            correo: adminEps?.correo || '',
            contrasena: '',
            rutaFoto: adminEps?.rutaFoto || '',
            estado: adminEps?.estado || 'ACTIVO',
            idRolSistema: currentIdRolSistema,
        });
    }, [adminEps, adminEpsRoleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id_eps') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.id_eps || isNaN(formData.id_eps) || formData.id_eps === '') {
            alert('Por favor, selecciona una EPS válida.');
            return;
        }
        if (!formData.dni || !formData.apellidos || !formData.nombres || !formData.correo || !formData.estado || formData.idRolSistema === null || formData.idRolSistema === '') {
            alert('Por favor, completa todos los campos obligatorios (DNI, Nombres, Apellidos, Correo, Estado) y asegúrate de que el Rol Sistema esté cargado.');
            return;
        }
        if (!adminEps && !formData.contrasena) {
            alert('Para un nuevo Administrador de EPS, la contraseña es obligatoria.');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="modal-form-content">
            <h3>{adminEps ? 'Editar Administrador de EPS' : 'Agregar Nuevo Administrador de EPS'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>EPS Asociada:</label>
                        <select name="id_eps" value={formData.id_eps} onChange={handleChange} required>
                            <option value="">Selecciona una EPS</option>
                            {epsOptions.map(eps => (
                                <option key={eps.idEps} value={eps.idEps}>{eps.nombreEps}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>DNI:</label>
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
                    <div className="form-group">
                        <label>Teléfono (Opcional):</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="9" />
                    </div>
                    <div className="form-group full-width">
                        <label>Correo:</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>

                    <div className="form-group password-input-wrapper full-width">
                        <label>Contraseña {adminEps ? '(dejar vacío para no cambiar)' : '*'}:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required={!adminEps}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password-button"
                        >
                            {showPassword ? '🙈' : '👀'}
                        </button>
                    </div>

                    <div className="form-group full-width">
                        <label>Ruta Foto (Opcional):</label>
                        <input type="text" name="rutaFoto" value={formData.rutaFoto} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Estado:</label>
                        <select name="estado" value={formData.estado} onChange={handleChange} required>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Rol en el Sistema:</label>
                        <input
                            type="text"
                            value={'ADMIN_EPS'}
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
                        {adminEps ? 'Guardar Cambios' : 'Añadir Administrador EPS'}
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default AdminEpsForm;