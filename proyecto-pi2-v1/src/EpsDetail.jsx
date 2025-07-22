import React from 'react';

function EpsDetail({ eps }) {
  if (!eps) {
    return <p>No se encontraron detalles de la EPS.</p>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', margin: '20px 0', textAlign: 'left' }}>
      <h3>Detalles de la EPS: {eps.nombreEps}</h3>
      <p><strong>RUC:</strong> {eps.ruc}</p>
      <p><strong>Dirección:</strong> {eps.direccion || 'N/A'}</p>
      <p><strong>Teléfono:</strong> {eps.telefono || 'N/A'}</p>
      <p><strong>Estado:</strong> {eps.estado}</p>
    </div>
  );
}

export default EpsDetail;