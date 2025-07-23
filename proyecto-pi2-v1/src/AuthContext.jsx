import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const authAxios = axios.create();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedJwt = localStorage.getItem('jwt');

    if (storedUser && storedJwt) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${storedJwt}`;
      } catch (error) {
        console.error("Error al parsear el usuario o JWT de localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
      }
    }
    setLoading(false);
  }, []);

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
    localStorage.setItem('jwt', userData.jwt);
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${userData.jwt}`;
  };

  const logout = async (callback) => {
    try {
      console.log("Frontend: Enviando solicitud de cierre de sesión al backend (para limpieza del lado del servidor)...");
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
      console.log("Frontend: Solicitud de cierre de sesión al backend completada.");
    } catch (error) {
      console.error("Frontend: Error al cerrar sesión en el backend:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      delete authAxios.defaults.headers.common['Authorization'];

      document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

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
    return !!user && !!localStorage.getItem('jwt');
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    authAxios,
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