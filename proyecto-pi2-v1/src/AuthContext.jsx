import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crea el contexto
const AuthContext = createContext(null);

// Configura una instancia de Axios global con interceptores
const authAxios = axios.create();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedJwt = localStorage.getItem('jwt'); // Recuperar el JWT

    if (storedUser && storedJwt) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Configurar el header de autorización para todas las peticiones de authAxios
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${storedJwt}`;
      } catch (error) {
        console.error("Error al parsear el usuario o JWT de localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('jwt'); // Limpiar también el JWT si hay un error
      }
    }
    setLoading(false);
  }, []);

  // Interceptor para añadir el token JWT a todas las peticiones salientes
  // Esto asegura que `axios` normal y `authAxios` usen el token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('jwt', userData.jwt); // Guardar el JWT recibido
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${userData.jwt}`; // Actualizar el header de Axios
  };

  const logout = async (callback) => {
    try {
      console.log("Frontend: Enviando solicitud de cierre de sesión al backend (para limpieza del lado del servidor)...");
      // La llamada al backend es principalmente para limpiar el contexto de seguridad del servidor
      // y asegurar que cualquier sesión HTTP remanente sea invalidada.
      // Con JWTs, el logout es principalmente una limpieza del token en el cliente.
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
      console.log("Frontend: Solicitud de cierre de sesión al backend completada.");
    } catch (error) {
      console.error("Frontend: Error al cerrar sesión en el backend:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt'); // Eliminar el JWT del localStorage
      delete authAxios.defaults.headers.common['Authorization']; // Eliminar el header de Axios

      // --- Limpiar todas las cookies (importante para evitar problemas residuales) ---
      document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // --- FIN limpieza de cookies ---

      console.log("Frontend: Estado de usuario local, localStorage y JWT limpiados.");
      if (callback) {
        callback();
      }
    }
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.roles) {
      return false;
    }
    const formattedRequiredRole = requiredRole.startsWith('ROLE_') ? requiredRole : `ROLE_${requiredRole.toUpperCase()}`;
    return user.roles.includes(formattedRequiredRole);
  };

  const isAuthenticated = () => {
    // Un usuario está autenticado si existe en el estado y hay un JWT en localStorage
    return !!user && !!localStorage.getItem('jwt');
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    authAxios, // Exponer la instancia de axios pre-configurada (opcional, pero útil)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};