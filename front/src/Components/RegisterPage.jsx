import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // Importar o Header
import './css/RegisterPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Novo estado para a mensagem de sucesso
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Enviando dados para o back end
      const response = await axios.post("https://video-game-store-aczz.onrender.com/auth/register", {
        username,
        email,
        password,
      });

      console.log('User registered:', response.data);
      // Exibir a mensagem de sucesso
      setSuccessMessage('Registro realizado com sucesso! Redirecionando para login...');
      // Redirecionar após um pequeno delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Atraso de 2 segundos para mostrar a mensagem
    } catch (error) {
      console.error('There was an error registering the user:', error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <Header /> {/* Renderiza o Header */}
      <div className="register-container">
        <h2>Registrar</h2>
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
          <button type="submit" className="register-button">Registrar</button>
          <button type="button" onClick={handleBackToLogin} className='back'>Voltar</button>
        </form>
        {/* Exibe a mensagem de sucesso, se existir */}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default RegisterPage;
