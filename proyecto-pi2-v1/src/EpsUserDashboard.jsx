import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EpsUserDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id_eps } = useParams(); // Obtiene el id_eps de la URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated() || !user || !user.roles.includes('ROLE_USUARIO_EPS')) {
      navigate('/unauthorized');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dni = user.username;

        const response = await axios.get(`http://localhost:8080/api/usuarios-eps/dni/${dni}`);
        const fetchedUserData = response.data;

        if (fetchedUserData && fetchedUserData.eps && String(fetchedUserData.eps.id) !== id_eps) {
          setError('El ID de la EPS en la URL no coincide con la EPS asignada a este usuario.');
          navigate('/unauthorized');
          return;
        }

        setUserData(fetchedUserData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar los datos del usuario o de la EPS. Asegúrate de que los servicios backend estén corriendo y que los datos estén asociados correctamente.');
        navigate('/unauthorized');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, navigate, id_eps]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div>Cargando datos de usuario y EPS...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No se encontraron datos para este usuario.</div>;
  }

  const {
    nombres,
    apellidos,
    dni,
    rutaFoto,
    areaUsuarioCaracter,
    estado,
    rolEps,
    eps,
    rolSistema
  } = userData;

  return (
    <div className="eps-user-dashboard">
      <h1>Panel de Usuario EPS</h1>
      <p>Bienvenido, {nombres} {apellidos}. Tienes el rol de sistema: {rolSistema?.nombreRol}.</p>

      <section>
        <h2>Datos del Usuario</h2>
        <p><strong>DNI:</strong> {dni}</p>
        <p><strong>Nombres:</strong> {nombres}</p>
        <p><strong>Apellidos:</strong> {apellidos}</p>
        {areaUsuarioCaracter && <p><strong>Área:</strong> {areaUsuarioCaracter}</p>}
        <p><strong>Estado:</strong> {estado}</p>
        <p><strong>Rol en EPS:</strong> {rolEps?.nombreRol}</p>
        {rutaFoto && <p><strong>Ruta de Foto:</strong> {rutaFoto}</p>}
      </section>

      {eps && (
        <section>
          <h2>Datos de la EPS a la que perteneces (ID: {eps.id})</h2>
          <p><strong>Nombre de EPS:</strong> {eps.nombreEps}</p>
          <p><strong>RUC:</strong> {eps.ruc}</p>
          <p><strong>Dirección:</strong> {eps.direccion}</p>
          <p><strong>Teléfono de EPS:</strong> {eps.telefono}</p>
          <p><strong>Fecha de Registro de EPS:</strong> {new Date(eps.fechaRegistro).toLocaleDateString()}</p>
          <p><strong>Estado de EPS:</strong> {eps.estado}</p>
        </section>
      )}

      <button onClick={handleLogout}>Cerrar Sesión</button>
      <p><a href="/">Ir a la página principal</a></p>
    </div>
  );
}

export default EpsUserDashboard;