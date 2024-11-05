import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Certifique-se de que você tenha o AuthContext
import Header from './Header'; // Importar o Header
import './css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAuth(); // Acesse a função de login do contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      
      // Atualize o estado de autenticação com token, userId e userRole
      login(response.data.token, response.data.userId, response.data.role); // Adicione o papel aqui
      
      // Verifica se o papel está sendo armazenado corretamente
      console.log('Stored role:', response.data.role); // Console log para verificar o papel

      navigate('/'); // Redirecione para a página inicial ou onde desejar
    } catch (error) {
      console.error('There was an error logging in:', error);
      setError('Email ou senha inválidos.'); 
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div>
      <Header /> {/* Renderiza o Header */}
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" id='login' className='login-button'>Login</button>
        </form>
        <button onClick={handleRegisterRedirect} className="register-button">
          Registrar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
