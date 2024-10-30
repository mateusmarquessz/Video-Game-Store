import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token); // Armazenar token
    setIsAuthenticated(true); // Atualiza o estado
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove o token
    setIsAuthenticated(false); // Atualiza o estado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
