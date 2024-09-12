import React, { useState } from 'react';
import "./css/Header.css";
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';

function Header() {
  const [showPanel, setShowPanel] = useState('');
  const [activeTab, setActiveTab] = useState('cart');

  const togglePanel = (panel) => {
    setShowPanel(showPanel === panel ? '' : panel);
    setActiveTab(panel === 'cart' ? 'cart' : 'favorites');
  };

  return (
    <header className="header">
      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/game-store">Game Store</Link>
          </li>
          <li className="nav-item">
            <Link to="/news">News</Link>
          </li>
        </ul>
      </nav>
      <div className="icons">
        <div className="icon" onClick={() => togglePanel('cart')}>
          <i><FiShoppingCart /></i>
          {showPanel === 'cart' && (
            <div className="dropdown-panel">
              <div className="tabs">
                <button
                  className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cart')}
                >
                  Cart
                </button>
                <button
                  className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  Favorites
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'cart' ? (
                  <>
                    <h4>Your Cart</h4>
                    <p>Game 1</p>
                    <p>Game 2</p>
                    <p>Game 3</p>
                    {/* Coloque aqui a lógica para exibir os jogos reais no carrinho */}
                  </>
                ) : (
                  <>
                    <h4>Your Favorites</h4>
                    <p>Favorite Game 1</p>
                    <p>Favorite Game 2</p>
                    <p>Favorite Game 3</p>
                    {/* Coloque aqui a lógica para exibir os favoritos reais */}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="icon" onClick={() => togglePanel('favorites')}>
          <i><FiHeart /></i>
          {showPanel === 'favorites' && (
            <div className="dropdown-panel">
              <div className="tabs">
                <button
                  className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  Favorites
                </button>
                <button
                  className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cart')}
                >
                  Cart
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'favorites' ? (
                  <>
                    <h4>Your Favorites</h4>
                    <p>Favorite Game 1</p>
                    <p>Favorite Game 2</p>
                    <p>Favorite Game 3</p>
                    {/* Coloque aqui a lógica para exibir os favoritos reais */}
                  </>
                ) : (
                  <>
                    <h4>Your Cart</h4>
                    <p>Game 1</p>
                    <p>Game 2</p>
                    <p>Game 3</p>
                    {/* Coloque aqui a lógica para exibir os jogos reais no carrinho */}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="icon">
          <Link to="/UserPage">
            <i><FiUser /></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
