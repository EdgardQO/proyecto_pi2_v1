import React, { useState, useEffect } from 'react';

function EpsForm({ eps, onSubmit, onCancel, message, isError }) {
  const [formData, setFormData] = useState({
    idEps: eps?.idEps || null,
    nombreEps: eps?.nombreEps || '',
    ruc: eps?.ruc || '',
    direccion: eps?.direccion || '',
    telefono: eps?.telefono || '',
    fechaRegistro: eps?.fechaRegistro ? new Date(eps.fechaRegistro).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    estado: eps?.estado || 'ACTIVO',
  });

  useEffect(() => {
    setFormData({
      idEps: eps?.idEps || null,
      nombreEps: eps?.nombreEps || '',
      ruc: eps?.ruc || '',
      direccion: eps?.direccion || '',
      telefono: eps?.telefono || '',
      fechaRegistro: eps?.fechaRegistro ? new Date(eps.fechaRegistro).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      estado: eps?.estado || 'ACTIVO',
    });
  }, [eps]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombreEps || !formData.ruc || !formData.estado || !formData.fechaRegistro) {
      alert('Por favor, completa todos los campos obligatorios (Nombre EPS, RUC, Fecha Registro, Estado).');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-form-content">
      <h3>{eps ? 'Editar EPS' : 'Agregar Nueva EPS'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Nombre EPS:</label>
            <input type="text" name="nombreEps" value={formData.nombreEps} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>RUC:</label>
            <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} required maxLength="11" />
          </div>
          <div className="form-group">
            <label>Teléfono (Opcional):</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="9" />
          </div>
          <div className="form-group full-width">
            <label>Dirección (Opcional):</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Fecha de Registro:</label>
            <input
              type="datetime-local"
              name="fechaRegistro"
              value={formData.fechaRegistro}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>
        </div>

        {message && (
          <p className={isError ? 'message-error' : 'message-success'}>
            {message}
          </p>
        )}

        <div className="form-buttons">
          <button type="submit" className="primary-button">
            {eps ? 'Guardar Cambios' : 'Añadir EPS'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default EpsForm;