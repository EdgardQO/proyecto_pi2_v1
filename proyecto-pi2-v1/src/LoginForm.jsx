import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json(); // Espera un JSON con username, fullName, roles, idEps (si aplica)
        setMessage(`¡Login exitoso! Bienvenido ${userData.fullName || userData.username}`);
        setIsError(false);
        login(userData); // Almacena todos los datos del usuario en el contexto
        
        // Redirige según el rol obtenido
        if (userData.roles.includes('ROLE_ADMIN_CENTRAL')) {
          navigate('/dashboard/admin-central');
        } else if (userData.roles.includes('ROLE_ADMIN_EPS')) {
          navigate('/dashboard/admin-eps');
        } else if (userData.roles.includes('ROLE_USUARIO_EPS')) {
          navigate('/dashboard/usuario-eps');
        } else {
          // Si no tiene un rol específico para redirigir, va a una página por defecto o de error
          navigate('/unauthorized');
        }

      } else {
        const errorData = await response.text(); // O response.json() si devuelve un objeto de error
        setMessage(`Error al iniciar sesión: ${errorData || response.statusText}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMessage('No se pudo conectar al servidor. Inténtalo de nuevo más tarde.');
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario (Correo/DNI):</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            // Nota: Para usuarios de tipo USUARIO_EPS, el 'username' debe ser el DNI.
            // Para administradores, puede ser correo o DNI.
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>
      {message && (
        <p className={`login-message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default LoginForm;