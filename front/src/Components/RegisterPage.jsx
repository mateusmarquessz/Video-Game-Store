import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/RegisterPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Enviando dados para o back end
      const response = await axios.post('http://localhost:8080/users/register', {
        username,
        email,
        password,
      });

      console.log('User registered:', response.data);
      // Redirecionar após o registro bem-sucedido
      navigate('/login');
    } catch (error) {
      console.error('There was an error registering the user:', error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="register-button">Register</button>
        <button type="button" onClick={handleBackToLogin} className='voltar'>Voltar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
