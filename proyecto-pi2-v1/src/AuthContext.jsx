import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crea el contexto
const AuthContext = createContext(null);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario de localStorage:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async (callback) => { // Acepta un callback para la navegación
    try {
      console.log("Frontend: Enviando solicitud de cierre de sesión al backend...");
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
      console.log("Frontend: Solicitud de cierre de sesión al backend completada.");
    } catch (error) {
      console.error("Frontend: Error al cerrar sesión en el backend:", error);
      // Opcional: mostrar un mensaje de error persistente al usuario.
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      console.log("Frontend: Estado de usuario local y localStorage limpiados.");
      if (callback) {
        callback(); // Llama al callback (ej. navigate('/login')) después de la limpieza
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
    return !!user;
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
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