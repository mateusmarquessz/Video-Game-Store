import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './css/GamePage.css'; // Importando o CSS

function GamePage() {
  const { id } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated, userId, token } = useAuth(); // Pegue o estado do AuthContext

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error("There was an error fetching the game!", error);
        setError("Não foi possível carregar os dados do jogo.");
      }
    };

    fetchGame();
  }, [id]);

   // Toggle favorite game
   const toggleFavorite = async (gameId) => {
    if (!isAuthenticated || !userId) return; // Verifique se o usuário está autenticado antes de permitir alterar favoritos

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (favorites.includes(gameId)) {
        // DELETE para desfavoritar
        await axios.delete(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorites((prevFavorites) => prevFavorites.filter(id => id !== gameId));
      } else {
        // POST para favoritar
        await axios.post(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorites((prevFavorites) => [...prevFavorites, gameId]);
      }
    } catch (error) {
      console.error("Error toggling favorite!", error);
    }
  };

  // Toggle cart
  const toggleCart = async (gameId) => {
    if (!isAuthenticated || !userId) return;

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (cartItems.includes(gameId)) {
        await axios.delete(`http://localhost:8080/users/${userId}/Cart/${gameId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCartItems((prevCart) => prevCart.filter(id => id !== gameId));
      } else {
        await axios.post(`http://localhost:8080/users/${userId}/Cart/${gameId}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCartItems((prevCart) => [...prevCart, gameId]);
      }
    } catch (error) {
      console.error("Error toggling Cart!", error);
    }
  };

  // Check if game is in cart
  const isInCart = (gameId) => {
    return cartItems.includes(gameId);
  };

  // Check if game is favorite
  const isFavorite = (gameId) => {
    return favorites.includes(gameId);
  };

  if (error) return <div className="error">{error}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-image">
          <img src={game.imageUrl} alt={game.name} />
        </div>
        <div className="game-details">
          <div className='gambiarra'>
            <h1 className='game-name'>{game.name}</h1>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }}
            className="favorite-button-gamepage"
            aria-label={isFavorite(game.id) ? 'Desfavoritar jogo' : 'Favoritar jogo'}
            title={isFavorite(game.id) ? 'Desfavoritar' : 'Favoritar'}
          >
            {isFavorite(game.id) ? (
              <FaHeart color="#e58e27" />
            ) : (
              <FaRegHeart />
            )}
          </button></div>
          <p className="genre">Gênero: {game.genre}</p>
          <p className="support">Tipo de Suporte: {game.typeOfSupport}</p>
          <p className="price">Preço: R${game.price.toFixed(2)}</p>
          <button className="buy-button" onClick={(e) => {
            e.stopPropagation();
            toggleCart(game.id);
          }}>
            Comprar
          </button>
        </div>
      </div>
    </>
  );
}

export default GamePage;
