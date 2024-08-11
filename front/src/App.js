// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';
import './App.css';

function App() {
  //Mudar isso muda as rotas
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="App">
                <Header />
                <div className="content">
                  <Sidebar />
                  <MainContent />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
