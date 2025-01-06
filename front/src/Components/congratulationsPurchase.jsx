import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CongratulationsPurchase.css';
import Header from './Header';

const CongratulationsPurchase = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Redirecionar para a página de jogos
    navigate('/gamestore');
  };

  const handleGoHome = () => {
    // Redirecionar para a página inicial do site
    navigate('/');
  };

  return (
    <>
      <Header />
      <div className="congratulations-container">
        <div className="congratulations-thumbnail">
          <h1 className="congratulations-heading">Parabéns pela sua compra!</h1>
          <p className="congratulations-message">
            Você comprou um novo jogo com sucesso. Aproveite sua experiência de jogo!
          </p>
          <div className="congratulations-button-container">
            <button className="congratulations-button" onClick={handleContinueShopping}>
              Continuar comprando
            </button>
            <button className="congratulations-button" onClick={handleGoHome}>
              Ir para a home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CongratulationsPurchase;