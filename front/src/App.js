// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import AdminPage from './Components/AdminPage';
import MainPage from './Components/MainPage';
import UserPage from './Components/UserPage';
import NewsPage from './Components/NewsPage';
import HomePage from './Components/HomePage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="App">
                <Header />
                <div className="content">
                  <AdminPage isAuthenticated={isAuthenticated} />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/GameStore" element={<MainPage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
