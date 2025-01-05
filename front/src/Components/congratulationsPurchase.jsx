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
        <h1 className="congratulations-heading">Congratulations on Your Purchase!</h1>
        <p className="congratulations-message">
          You have successfully purchased a new game. Enjoy your gaming experience!
        </p>
        <div className="congratulations-button-container">
          <button className="congratulations-button" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
          <button className="congratulations-button" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CongratulationsPurchase;