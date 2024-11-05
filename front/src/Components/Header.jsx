import React, { useEffect, useState } from 'react';
import "./css/Header.css";
import { FiShoppingCart, FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function Header() {
  const [showPanel, setShowPanel] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, userId, userRole } = useAuth(); // Adiciona userRole
  const navigate = useNavigate();

  const togglePanel = (panel) => {
    setShowPanel(showPanel === panel ? '' : panel);
  };

  const handleUserIconClick = () => {
    navigate(isAuthenticated ? '/UserPage' : '/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]); // Chama fetchFavorites sempre que a autenticação mudar

  return (
    <header className="header">
      <nav className="navigation">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FiMenu />
        </button>
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
          <li className="nav-item"><Link to="/" className='a'>Home</Link></li>
          
          {userRole === 'ROLE_ADMIN' && (
            <li className="nav-item"><Link to="/admin" className='a'>Admin Page</Link></li>
          )}

          {userRole === 'ROLE_USER' &&(
            <li className="nav-item"><Link to="/gamestore" className='a'>Game Store</Link></li>
          )}

          <li className="nav-item"><Link to="/news" className='a'>News</Link></li>
        </ul>
      </nav>
      <div className="icons">
        <div className="icon" onClick={() => togglePanel('cart')}>
          <FiShoppingCart />
          {showPanel === 'cart' && (
            <div className="dropdown-panel">
              <h4 className='dropdown-h4'>Your Cart</h4>
              {}
            </div>
          )}
        </div>
        <div className="icon" onClick={() => togglePanel('favorites')}>
          <FiHeart />
          {showPanel === 'favorites' && (
            <div className="dropdown-panel">
              <h4 className='dropdown-h4'>Your Favorites</h4>
              {favorites.length > 0 ? (
                <ul>
                  {favorites.map(game => (
                    <li key={game.id}>{game.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No favorites yet.</p>
              )}
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
