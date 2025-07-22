import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto
const AuthContext = createContext(null);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena el objeto de usuario (username, roles, etc.)
  const [loading, setLoading] = useState(true); // Para saber si ya se cargó el estado inicial

  // Carga el usuario desde localStorage al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario de localStorage:", error);
        localStorage.removeItem('user'); // Limpiar si está corrupto
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Guarda en localStorage
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Elimina de localStorage
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole) => {
    if (!user || !user.roles) {
      return false;
    }
    // Los roles de Spring Security suelen venir con "ROLE_" prefijo.
    // Aseguramos que el rol buscado también lo tenga para la comparación.
    const formattedRequiredRole = requiredRole.startsWith('ROLE_') ? requiredRole : `ROLE_${requiredRole.toUpperCase()}`;
    return user.roles.includes(formattedRequiredRole);
  };

  // Puedes añadir una función para verificar si está autenticado
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
      {!loading && children} {/* Renderiza los hijos solo después de cargar el estado */}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};