import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Se estiver usando Axios
import './css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Enviando dados para o back end
      const response = await axios.post('http://localhost:8080/users/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      // Redirecionar após o login bem-sucedido
      navigate('/'); // Redirecione para a página desejada após o login
    } catch (error) {
      console.error('There was an error logging in:', error);
      // Adicione tratamento de erro, como exibir uma mensagem ao usuário
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
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
        <button type="submit" id='login' className='login-button'>Login</button>
      </form>
      <button onClick={handleRegisterRedirect} className="register-button">
        Register
      </button>
    </div>
  );
};

export default LoginPage;
