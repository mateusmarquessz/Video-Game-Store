import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Armazena o ID do usuário
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); // Armazena o papel do usuário

  const login = (token, id, role) => {
    localStorage.setItem('token', token); // Armazenar token
    localStorage.setItem('userId', id);
    localStorage.setItem('userRole', role); // Armazenar ID do usuário
    setIsAuthenticated(true); // Atualiza o estado
    setUserId(id);
    setUserRole(role); // Atualiza o estado do ID do usuário
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove o token
    localStorage.removeItem('userId'); // Remove o ID do usuário
    localStorage.removeItem('userRole'); // Corrigido para remover o papel do usuário
    setIsAuthenticated(false); // Atualiza o estado
    setUserId(null); 
    setUserRole(null); // Limpa o estado do ID do usuário
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, userRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
