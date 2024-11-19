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
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated, userId, userRole } = useAuth();
  const navigate = useNavigate();

  const togglePanel = (panel) => {
    setShowPanel(showPanel === panel ? '' : panel);
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate('/UserPage');
    } else {
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/users/${userId}/Cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data);
    } catch (error) {
      setError('Error fetching cart items. Please try again.');
      console.error("Error fetching cart:", error);
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      await axios.delete(`http://localhost:8080/users/${userId}/Cart/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setCartItems(cartItems.filter(game => game.id !== gameId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const removeFromFavorites = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Envia uma requisição para remover o item dos favoritos no backend
      await axios.delete(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Atualiza o estado dos favoritos removendo o item localmente
      setFavorites(favorites.filter(game => game.id !== gameId));
      window.location.reload(); 
    } catch (error) {
      console.error("Error removing item from favorites:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
      toggleCart();
    }
  }, [isAuthenticated]);

  const cartTotal = cartItems.reduce((total, game) => total + game.price, 0);

  return (
    <header className="header">
      <nav className="navigation">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FiMenu />
        </button>
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
          <li className="nav-item"><Link to="/" className='a'>Home</Link></li>
          {userRole === 'ROLE_ADMIN' && (
            <li className="nav-item"><Link to="/admin" className='a'>Admin Page</Link></li>
          )}
          {userRole !== 'ROLE_ADMIN' && (
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
              {cartItems.length > 0 ? (
                <>
                  <ul>
                    {cartItems.map(game => (
                      <li key={game.id} className="cart-item">
                        <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="cart-item-image" />
                        <span>{game.name}</span>
                        <span>${game.price.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(game.id)} className="remove-button">Remover</button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-total">
                    <strong>Total:</strong> ${cartTotal.toFixed(2)}
                  </div>
                </>
              ) : (
                <p>No items in your cart.</p>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </div>
        <div className="icon" onClick={() => togglePanel('favorites')}>
          <FiHeart />
          {showPanel === 'favorites' && (
            <div className="dropdown-panel">
              <h4 className='dropdown-h4'>Your Favorites</h4>
              {favorites.length > 0 ? (
                <ul className="favorites-list">
                  {favorites.map(game => (
                    <li key={game.id} className="favorite-item">
                      <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="favorite-item-image" />
                      <span>{game.name}</span>
                      <button onClick={() => removeFromFavorites(game.id)} className="remove-button">Remover</button>
                    </li>
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
