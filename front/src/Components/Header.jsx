import React, { useState } from 'react';
import "./css/Header.css";
import { FiShoppingCart, FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCartFavorites } from './CartFavoritesContext';

function Header() {
  const [showPanel, setShowPanel] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const { cartItems, favorites, removeFromCart, removeFromFavorites } = useCartFavorites();
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

  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const cartTotal = cartItems.reduce((total, game) => {
    const price = game.price || 0;
    return total + price;
  }, 0);


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
          {cartItems.length > 0 && (
            <span className="cart-item-count">{cartItems.length}</span>
          )}
          {showPanel === 'cart' && (
            <div className="dropdown-panel">
              <h4 className="dropdown-h4">Your Cart</h4>
              {cartItems.length > 0 ? (
                <>
                  <ul>
                    {cartItems.map(game => (
                      <li key={game.id} className="cart-item" onClick={() => handleRedirect(game.id)}>
                        <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="cart-item-image" />
                        <span>{game.name}</span>
                        <span>${(game.price || 0).toFixed(2)}</span> {/* Verifique se price é um número válido */}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(game.id);
                        }} className="remove-button">Remover</button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-total">
                    <strong>Total:</strong> ${cartTotal.toFixed(2)}
                  </div>
                  <button
                    className="checkout-button-header"
                    onClick={() => navigate('/checkout')}
                  >
                    Finalizar Compra
                  </button>
                </>
              ) : (
                <p>No items in your cart.</p>
              )}
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
                    <li key={game.id} className="favorite-item" onClick={() => handleRedirect(game.id)}>
                      <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="favorite-item-image" />
                      <span>{game.name}</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(game.id);
                      }} className="remove-button">Remover</button>
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