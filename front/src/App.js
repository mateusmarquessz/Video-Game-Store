// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Adicione Navigate aqui
import Header from './Components/Header';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import AdminPage from './Components/AdminPage';
import MainPage from './Components/MainPage';
import UserPage from './Components/UserPage';
import NewsPage from './Components/NewsPage';
import HomePage from './Components/HomePage';
import GamePage from './Components/GamePage';
import './App.css';
import { AuthProvider, useAuth } from './Components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/UserPage" element={<UserPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/admin" element={<AdminPageWrapper />} />
          <Route path="/GameStore" element={<GameStore />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente para gerenciar o acesso à GameStore
const GameStore = () => {
  const { userRole } = useAuth(); // Acessa o papel do usuário do contexto

  return (
    <div className="App">
      <Header />
      <div className="content">
        {userRole === 'ROLE_ADMIN' ? <AdminPage /> : <MainPage />}
      </div>
    </div>
  );
};

// Componente para a página admin
const AdminPageWrapper = () => {
  const { userRole } = useAuth();
  
  return userRole === 'ROLE_ADMIN' ? <AdminPage /> : <Navigate to="/" />;
};

export default App;
