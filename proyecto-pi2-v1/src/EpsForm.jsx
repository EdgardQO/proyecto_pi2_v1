import React, { useState, useEffect } from 'react';

function EpsForm({ eps, onSubmit, onCancel, message, isError }) {
  const [formData, setFormData] = useState({
    idEps: eps?.idEps || null,
    nombreEps: eps?.nombreEps || '',
    ruc: eps?.ruc || '',
    direccion: eps?.direccion || '',
    telefono: eps?.telefono || '',
    // --- CAMBIO CLAVE AQUÍ: Asegurar formato ISO completo para LocalDateTime ---
    fechaRegistro: eps?.fechaRegistro ? new Date(eps.fechaRegistro).toISOString().slice(0, 19) : new Date().toISOString().slice(0, 19), // YYYY-MM-DDTHH:MM:SS
    // Si prefieres solo fecha, podrías usar .toISOString().split('T')[0] y cambiar el tipo en backend a LocalDate.
    // Pero si quieres LocalDateTime, esto es lo compatible.
    // --- FIN CAMBIO CLAVE ---
    estado: eps?.estado || 'ACTIVO',
  });

  useEffect(() => {
    setFormData({
      idEps: eps?.idEps || null,
      nombreEps: eps?.nombreEps || '',
      ruc: eps?.ruc || '',
      direccion: eps?.direccion || '',
      telefono: eps?.telefono || '',
      fechaRegistro: eps?.fechaRegistro ? new Date(eps.fechaRegistro).toISOString().slice(0, 19) : new Date().toISOString().slice(0, 19),
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
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left' }}>
      <h3>{eps ? 'Editar EPS' : 'Agregar Nueva EPS'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre EPS:</label>
          <input type="text" name="nombreEps" value={formData.nombreEps} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>RUC:</label>
          <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} required maxLength="11" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Dirección (Opcional):</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Teléfono (Opcional):</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="9" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Fecha de Registro:</label>
          {/* CAMBIO: El input type="date" solo maneja YYYY-MM-DD. Para LocalDateTime, es mejor usar type="datetime-local" o enviar solo la fecha si el backend realmente usa LocalDate */}
          {/* Por ahora, mantendremos type="date" y ajustaremos el valor enviado para que sea ISO sin milisegundos. */}
          {/* Si quieres que el usuario introduzca también la hora, cambia type="date" a type="datetime-local" */}
          <input type="date" name="fechaRegistro" value={formData.fechaRegistro.split('T')[0]} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Estado:</label>
          <select name="estado" value={formData.estado} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>

        {message && (
          <p style={{ color: isError ? 'red' : 'green', marginBottom: '10px' }}>
            {message}
          </p>
        )}

        <button type="submit" style={{ marginRight: '10px' }}>
          {eps ? 'Guardar Cambios' : 'Añadir EPS'}
        </button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default EpsForm;