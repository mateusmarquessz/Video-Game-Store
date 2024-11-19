import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import './css/MainContent.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from './AuthContext'; // Importe o contexto de autenticação

function MainPage() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, userId, token } = useAuth(); // Pegue o estado do AuthContext

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:8080/games'); // Carregar jogos sem autenticação
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };

    fetchGames(); // Adiciona o carregamento dos favoritos
  }, [isAuthenticated, userId, token]); // Dependências de autenticação para recarregar os favoritos

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []); // Executa apenas uma vez na montagem do componente.
  

  // Redirect to game page
  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Toggle favorite game
  const toggleFavorite = async (gameId) => {
    if (!isAuthenticated || !userId) return;
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (favorites.includes(gameId)) {
        // DELETE para desfavoritar
        await axios.delete(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const updatedFavorites = favorites.filter(id => id !== gameId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Atualiza o localStorage
      } else {
        // POST para favoritar
        await axios.post(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const updatedFavorites = [...favorites, gameId];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Atualiza o localStorage
      }
      window.location.reload(); 
    } catch (error) {
      console.error("Error toggling favorite!", error);
    }
  };
  
  // Check if game is favorite
  const isFavorite = (gameId) => {
    return favorites.includes(gameId);
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
      window.location.reload();
    } catch (error) {
      console.error("Error toggling Cart!", error);
    }
  };
  
  // Check if game is in cart
  const isInCart = (gameId) => {
    return cartItems.includes(gameId);
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className='content'>
      <div className="main-content">
      <div className="carousel-container">
          <Slider {...carouselSettings}>
            {games.slice(0, 3).map((game, index) => (
              <div
                className="carousel-slide"
                key={index}
                onClick={() => handleRedirect(game.id)}
                style={{ cursor: 'pointer' }}
              >
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="carousel-image" />
                ) : (
                  <p>No image available</p>
                )}
                <h3>{game.name}</h3>
                <p>{game.typeOfSupport}</p>
                <p className='game-price'>R${game.price.toFixed(2)}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div className="game-thumbnails">
          {games.map((game, index) => (
            <div className="thumbnail" key={index} onClick={() => handleRedirect(game.id)}>
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.name} className="game-image" />
              ) : (
                <p>No image available</p>
              )}
              <h3>{game.name}</h3>
              <p>{game.typeOfSupport}</p>
              <p className='game-price'>R${game.price.toFixed(2)}</p>
              <button 
                className="view-game-button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleCart(game.id); 
                }}
              >
                Adicionar ao Carrinho
              </button>
              {isAuthenticated && (
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }} className="favorite-button">
                  {isFavorite(game.id) ? (
                    <FaHeart color="#e58e27" style={{ borderColor: "#161a1e" }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
