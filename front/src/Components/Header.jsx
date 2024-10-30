import React, { useState } from 'react';
import "./css/Header.css";
import { FiShoppingCart, FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Header() {
  const [showPanel, setShowPanel] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const togglePanel = (panel) => {
    setShowPanel(showPanel === panel ? '' : panel);
  };

  const handleUserIconClick = () => {
    console.log("Authenticated:", isAuthenticated);
    navigate(isAuthenticated ? '/UserPage' : '/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <nav className="navigation">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FiMenu />
        </button>
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
          <li className="nav-item"><Link to="/" className='a'>Home</Link></li>
          <li className="nav-item"><Link to="/gamestore" className='a'>Game Store</Link></li>
          <li className="nav-item"><Link to="/news" className='a'>News</Link></li>
        </ul>
      </nav>
      <div className="icons">
        <div className="icon" onClick={() => togglePanel('cart')}>
          <FiShoppingCart />
          {showPanel === 'cart' && (
            <div className="dropdown-panel">
              <h4 className='dropdown-h4'>Your Cart</h4>
              {/* Conteúdo do carrinho */}
            </div>
          )}
        </div>
        <div className="icon" onClick={() => togglePanel('favorites')}>
          <FiHeart />
          {showPanel === 'favorites' && (
            <div className="dropdown-panel">
              <h4 className='dropdown-h4'>Your Favorites</h4>
              {/* Conteúdo dos favoritos */}
            </div>
          )}
        </div>
        <div className="icon" onClick={handleUserIconClick}>
          <FiUser />
        </div>
      </div>
    </header>
  );
}

export default Header;
